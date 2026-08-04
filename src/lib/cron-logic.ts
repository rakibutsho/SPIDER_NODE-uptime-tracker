import { prisma } from "@/lib/prisma";
import { sendTelegramAlert } from "@/lib/telegram";

// Request timeout for ping (10 seconds)
const TIMEOUT_MS = 10 * 1000;

export async function runCronChecks() {
  // ----------------------------------------------------
  // 1. FETCH ACTIVE MONITORS WITH USER DATA
  // ----------------------------------------------------
  const monitors = await prisma.monitor.findMany({
    where: { isActive: true },
    include: {
      user: {
        select: { telegramChatId: true, name: true },
      },
    },
  });

  if (monitors.length === 0) {
    return { message: "No active monitors found", result: [] };
  }

  // ----------------------------------------------------
  // 2. FILTER BY INTERVAL (ONLY CHECK IF DUE)
  // ----------------------------------------------------
  const now = new Date();
  
  const monitorsToCheck = monitors.filter((monitor) => {
    // If it has never been checked, check it immediately
    if (!monitor.lastChecked) return true;
    
    // Calculate the next time it should be checked based on its interval (in minutes)
    const nextCheckTime = new Date(monitor.lastChecked.getTime() + monitor.interval * 60 * 1000);
    
    // It's due if the current time has passed the scheduled next check time
    return now >= nextCheckTime;
  });

  if (monitorsToCheck.length === 0) {
    return { message: "No monitors are due for a check right now", result: [] };
  }

  // ----------------------------------------------------
  // 3. CONCURRENTLY CHECK ALL WEBSITES
  // ----------------------------------------------------
  const checkResults = await Promise.allSettled(
    monitorsToCheck.map(async (monitor) => {
      const startTime = performance.now();
      let isUp = false;
      let responseTime = 0;
      let statusCode = 0;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const response = await fetch(monitor.url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent": "UptimeTrackerBot/1.0",
          },
        });

        clearTimeout(timeoutId);
        const endTime = performance.now();
        responseTime = Math.round(endTime - startTime);
        statusCode = response.status;

        // HTTP Status 200-399 means site is UP
        if (response.ok || (statusCode >= 200 && statusCode < 400)) {
          isUp = true;
        }
      } catch (error) {
        // Timeout or Network Failure means site is DOWN
        const endTime = performance.now();
        responseTime = Math.round(endTime - startTime);
        isUp = false;
      }

      const newStatus = isUp ? "UP" : "DOWN";
      const previousStatus = monitor.status;

      // ----------------------------------------------------
      // 3. TELEGRAM ALERT ON STATUS CHANGE
      // ----------------------------------------------------
      if (monitor.user?.telegramChatId && previousStatus !== newStatus) {
        if (previousStatus === "PENDING" && newStatus === "UP") {
          const message = `
🚀 <b>MONITORING STARTED: Website is Online!</b>

📌 <b>Name:</b> ${monitor.name}
🌐 <b>URL:</b> ${monitor.url}
⚡ <b>Response Time:</b> ${responseTime}ms
🕒 <b>Time:</b> ${new Date().toLocaleString()}
          `.trim();
          await sendTelegramAlert(monitor.user.telegramChatId, message);
        } else if (newStatus === "DOWN") {
          const message = `
🚨 <b>ALERT: Website Down!</b>

📌 <b>Name:</b> ${monitor.name}
🌐 <b>URL:</b> ${monitor.url}
⚠️ <b>Status Code:</b> ${statusCode || "No Response / Timeout"}
⏱️ <b>Response Time:</b> ${responseTime}ms
🕒 <b>Time:</b> ${new Date().toLocaleString()}
          `.trim();
          await sendTelegramAlert(monitor.user.telegramChatId, message);
        } else if (newStatus === "UP" && previousStatus === "DOWN") {
          const message = `
✅ <b>RECOVERY: Website Back Online!</b>

📌 <b>Name:</b> ${monitor.name}
🌐 <b>URL:</b> ${monitor.url}
⚡ <b>Response Time:</b> ${responseTime}ms
🕒 <b>Time:</b> ${new Date().toLocaleString()}
          `.trim();
          await sendTelegramAlert(monitor.user.telegramChatId, message);
        }
      }

      // ----------------------------------------------------
      // 4. UPDATE MONITOR IN DATABASE
      // ----------------------------------------------------
      return prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          status: newStatus,
          lastChecked: new Date(),
        },
      });
    }),
  );

  return { message: "Successfully checked all monitors", result: checkResults };
}
