import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ userId: string }>;
}

// ----------------------------------------------------
// PUBLIC STATUS PAGE DATA (no auth required)
// GET /api/status/[userId]
// ----------------------------------------------------
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const monitors = await prisma.monitor.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        name: true,
        url: true,
        status: true,
        uptimePercent: true,
        responseTime: true,
        lastChecked: true,
        interval: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Fetch the most recent incidents for each monitor
    const recentIncidents = await prisma.incident.findMany({
      where: {
        monitor: { userId },
        status: "ONGOING",
      },
      include: {
        monitor: { select: { name: true } },
      },
      orderBy: { startedAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ user, monitors, recentIncidents }, { status: 200 });
  } catch (error) {
    console.error("Public Status API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch status data" },
      { status: 500 },
    );
  }
}
