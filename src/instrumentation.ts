import cron from "node-cron";

export async function register() {
  // We only want to run the cron job on the Node.js server, not the edge runtime or browser
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const port = process.env.NEXT_PUBLIC_PORT || 5000;
    const cronSecret = process.env.CRON_SECRET || "your_super_secret_cron_key_123";

    console.log("🕒 Starting internal background Cron Job...");

    // Run every minute
    cron.schedule("* * * * *", async () => {
      try {
        console.log("🔄 Internal Cron Triggered: Checking monitors...");
        
        // Dynamic import to avoid Prisma initialization issues at the edge/startup phase
        const { runCronChecks } = await import("./lib/cron-logic");
        const { message, result } = await runCronChecks();
        
        console.log(`✅ Cron check completed successfully: ${message}`);
      } catch (error) {
        console.error("❌ Failed to run internal cron:", error);
      }
    });
  }
}
