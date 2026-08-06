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

    console.log("   └─ Polling every 1 minute.");
    console.log("   └─ To use Vercel Cron as primary instead, set CRON_MODE=vercel");
  }
}

