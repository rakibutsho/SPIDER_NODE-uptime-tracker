import { prisma } from "@/lib/prisma";

export async function runCleanup() {
  try {
    const now = new Date();

    // Calculate cutoff dates
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // 1. Delete Pings older than 30 days
    const deletedPings = await prisma.ping.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // 2. Delete resolved Incidents older than 90 days
    const deletedIncidents = await prisma.incident.deleteMany({
      where: {
        status: "RESOLVED",
        resolvedAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    const message = `Cleanup successful: Deleted ${deletedPings.count} old pings and ${deletedIncidents.count} old resolved incidents.`;
    console.log(`[Cleanup Job] ${message}`);

    return {
      success: true,
      message,
      deletedPings: deletedPings.count,
      deletedIncidents: deletedIncidents.count,
    };
  } catch (error: any) {
    console.error("[Cleanup Job] Failed to run cleanup:", error);
    return {
      success: false,
      message: "Failed to run cleanup",
      error: error.message,
    };
  }
}
