import { prisma } from "@/lib/prisma";
import { sendTelegramAlert } from "@/lib/telegram";

// Request timeout for ping (10 seconds)
const TIMEOUT_MS = 10 * 1000;

export async function runCronChecks(force = false) {
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

  const monitorsToCheck = force
    ? monitors // Skip interval filter — check everything immediately
    : monitors.filter((monitor) => {
        // If it has never been checked, check it immediately
        if (!monitor.lastChecked) return true;

        // Calculate the next time it should be checked based on its interval (in minutes)
        const nextCheckTime = new Date(
          monitor.lastChecked.getTime() + monitor.interval * 60 * 1000,
        );

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
          redirect: "follow", // Follow HTTP → HTTPS redirects
          cache: "no-store", // Disable Next.js fetch caching
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; UptimeTrackerBot/1.0)",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });

        clearTimeout(timeoutId);
        const endTime = performance.now();
        responseTime = Math.round(endTime - startTime);
        statusCode = response.status;

        // HTTP Status 200-399 means site is UP (includes 3xx that were followed)
        if (statusCode >= 200 && statusCode < 400) {
          isUp = true;
        }
      } catch (error: any) {
        // Timeout or Network Failure means site is DOWN
        const endTime = performance.now();
        responseTime = Math.round(endTime - startTime);
        isUp = false;
        // Log the real reason so we can debug false-downs
        console.error(
          `[CronCheck] FAILED for ${monitor.url} — ${error?.message ?? String(error)}`,
        );
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
      // 4. UPDATE MONITOR IN DATABASE & RECORD LOGS
      // ----------------------------------------------------
      const hasStatusChanged = previousStatus !== newStatus;

      if (!hasStatusChanged) {
        // FAST PATH: Routine check, no status change.
        // Queue in memory to save database compute.
        const { queueRoutineCheck } = await import("./db-batcher");
        queueRoutineCheck(monitor.id, newStatus, responseTime);
      } else {
        // SLOW PATH: Status changed or first check. Write to DB immediately.
        const totalChecks = (monitor.totalChecks || 0) + 1;
        const failedChecks = (monitor.failedChecks || 0) + (!isUp ? 1 : 0);
        const uptimePercent = Math.max(
          0,
          Math.min(100, ((totalChecks - failedChecks) / totalChecks) * 100),
        );

        const updateData: any = {
          status: newStatus,
          lastChecked: new Date(),
          responseTime,
          totalChecks,
          failedChecks,
          uptimePercent,
        };

        await prisma.monitor.update({
          where: { id: monitor.id },
          data: updateData,
        });

        // Insert Ping
        await prisma.ping.create({
          data: {
            monitorId: monitor.id,
            status: newStatus,
            responseTime,
          },
        });

        // Handle Incidents
        if (newStatus === "DOWN" && previousStatus !== "DOWN") {
          // Create new ongoing incident
          await prisma.incident.create({
            data: {
              monitorId: monitor.id,
              status: "ONGOING",
              description: `Monitor went down. Status code: ${statusCode || "Timeout"}`,
            },
          });
        } else if (newStatus === "UP" && previousStatus === "DOWN") {
          // Resolve ongoing incident
          const ongoingIncident = await prisma.incident.findFirst({
            where: { monitorId: monitor.id, status: "ONGOING" },
            orderBy: { startedAt: "desc" },
          });

          if (ongoingIncident) {
            await prisma.incident.update({
              where: { id: ongoingIncident.id },
              data: {
                status: "RESOLVED",
                resolvedAt: new Date(),
              },
            });
          }
        }
      }

      return monitor.id;
    }),
  );

  return { message: "Successfully checked all monitors", result: checkResults };
}
