import cron from "node-cron";

export async function register() {
  // Only run on Node.js runtime (not edge/browser)
  if (process.env.NEXT_RUNTIME === "nodejs") {

    // ----------------------------------------------------
    // DUAL-CRON STRATEGY:
    // Primary:  Vercel Cron → calls /api/cron/check externally (independent of VPS process)
    // Fallback: Internal node-cron → runs inside the VPS process as backup
    //
    // If CRON_MODE=vercel → Vercel is primary, internal cron is DISABLED (no duplicate checks)
    // If CRON_MODE=internal or not set → internal node-cron is the primary runner
    // ----------------------------------------------------

    const cronMode = process.env.CRON_MODE || "internal";

    if (cronMode === "vercel") {
      console.log("⚡ Cron Mode: VERCEL (external Vercel Cron is primary — internal cron disabled)");
      console.log("   └─ Vercel Cron will call /api/cron/check every minute independently.");
      console.log("   └─ To switch to internal fallback, set CRON_MODE=internal");
      return;
    }

    // Internal cron mode — runs on VPS, acts as primary or fallback
    console.log("🕒 Cron Mode: INTERNAL (node-cron running inside VPS process)");

    cron.schedule("* * * * *", async () => {
      try {
        console.log("🔄 Internal Cron Triggered: Checking monitors...");

        const { runCronChecks } = await import("./lib/cron-logic");
        const { message, result } = await runCronChecks();

        console.log(`✅ Cron check completed: ${message}`);

        // --- HEALTHCHECKS.IO (Dead Man's Switch) ---
        // If the ping URL is set in .env, hit it to let healthchecks.io know we are alive.
        if (process.env.HC_PING_URL) {
          fetch(process.env.HC_PING_URL)
            .then(() => console.log("💓 Heartbeat sent to healthchecks.io"))
            .catch((e) => console.error("❌ Failed to send heartbeat:", e));
        }
      } catch (error) {
        console.error("❌ Internal cron failed:", error);
        
        // Ping healthchecks.io with a /fail signal if something crashed internally
        if (process.env.HC_PING_URL) {
          fetch(`${process.env.HC_PING_URL}/fail`)
            .catch(() => {});
        }
      }
    });

    // Database Batch Flusher (Every 15 minutes)
    cron.schedule("*/15 * * * *", async () => {
      try {
        console.log("🔄 Flushing database batches...");
        const { flushBatches } = await import("./lib/db-batcher");
        await flushBatches();
      } catch (e) {
        console.error("❌ Failed to flush database batches:", e);
      }
    });

    // Database Cleanup (Daily at midnight)
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("🧹 Running daily database cleanup...");
        const { runCleanup } = await import("./lib/cleanup-logic");
        await runCleanup();
      } catch (e) {
        console.error("❌ Failed to run database cleanup:", e);
      }
    });

    console.log("   └─ Polling every 1 minute.");
    console.log("   └─ Flushing to DB every 15 minutes.");
    console.log("   └─ Cleaning old logs daily at midnight.");
    console.log("   └─ To use Vercel Cron as primary instead, set CRON_MODE=vercel");

    // Graceful shutdown flush
    const gracefulShutdown = async () => {
      console.log("🛑 Shutting down, flushing database batches...");
      try {
        const { flushBatches } = await import("./lib/db-batcher");
        await flushBatches();
      } catch (e) {
        console.error("❌ Shutdown flush failed:", e);
      }
      process.exit(0);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  }
}

