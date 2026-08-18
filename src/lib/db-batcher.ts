import { prisma } from "@/lib/prisma";

// In-memory queues
let pendingPings: any[] = [];

interface MonitorUpdate {
  totalChecks: number;
  failedChecks: number;
  lastChecked: Date;
  responseTime: number;
  status: string;
}

const pendingMonitorUpdates = new Map<number, MonitorUpdate>();

/**
 * Queues a routine ping and updates the monitor's running stats in memory.
 * This is ONLY called when the status has NOT changed.
 */
export function queueRoutineCheck(
  monitorId: number,
  status: string,
  responseTime: number
) {
  const now = new Date();

  // Queue ping
  pendingPings.push({
    monitorId,
    status,
    responseTime,
    createdAt: now,
  });

  // Update running monitor stats
  const current = pendingMonitorUpdates.get(monitorId) || {
    totalChecks: 0,
    failedChecks: 0,
    lastChecked: now,
    responseTime: 0,
    status,
  };

  pendingMonitorUpdates.set(monitorId, {
    totalChecks: current.totalChecks + 1,
    failedChecks: current.failedChecks + (status === "DOWN" ? 1 : 0),
    lastChecked: now,
    responseTime, // Keep the latest response time
    status,       // Keep the latest status
  });
}

/**
 * Flushes all queued data to the database in a batch.
 */
export async function flushBatches() {
  if (pendingPings.length === 0 && pendingMonitorUpdates.size === 0) {
    return; // Nothing to flush
  }

  console.log(`[DB Batcher] Flushing ${pendingPings.length} pings and ${pendingMonitorUpdates.size} monitor updates...`);

  // 1. Snapshot the queues and clear them immediately to allow new data to come in
  const pingsToInsert = [...pendingPings];
  const monitorsToUpdate = new Map(pendingMonitorUpdates);
  
  pendingPings = [];
  pendingMonitorUpdates.clear();

  try {
    // 2. Insert all Pings in one bulk operation
    if (pingsToInsert.length > 0) {
      await prisma.ping.createMany({
        data: pingsToInsert,
      });
    }

    // 3. Update all Monitors
    // We update them individually but concurrently. They are grouped in one flush cycle.
    const updatePromises = Array.from(monitorsToUpdate.entries()).map(async ([monitorId, stats]) => {
      // We need to fetch the current state to calculate the correct uptimePercent
      const monitor = await prisma.monitor.findUnique({
        where: { id: monitorId },
        select: { totalChecks: true, failedChecks: true },
      });

      if (!monitor) return;

      const newTotalChecks = monitor.totalChecks + stats.totalChecks;
      const newFailedChecks = monitor.failedChecks + stats.failedChecks;
      const uptimePercent = Math.max(0, Math.min(100, ((newTotalChecks - newFailedChecks) / newTotalChecks) * 100));

      return prisma.monitor.update({
        where: { id: monitorId },
        data: {
          totalChecks: newTotalChecks,
          failedChecks: newFailedChecks,
          uptimePercent,
          lastChecked: stats.lastChecked,
          responseTime: stats.responseTime,
          status: stats.status,
        },
      });
    });

    await Promise.allSettled(updatePromises);
    console.log(`[DB Batcher] Flush completed successfully.`);
  } catch (error) {
    console.error("[DB Batcher] Error flushing batches to DB:", error);
    // If it fails, we lose the batch. In a more robust system we could re-queue,
    // but losing a few routine UP pings is generally acceptable for a free-tier app.
  }
}
