import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// ----------------------------------------------------
// PUBLIC STATUS DATA — for the logged-in user's status page
// GET /api/status — returns all monitors (no auth needed)
// But we need a userId to scope it. We use a slug/userId approach.
// ----------------------------------------------------
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true },
    });

    const monitors = await prisma.monitor.findMany({
      where: { userId: session.user.id, isActive: true },
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

    return NextResponse.json({ user, monitors }, { status: 200 });
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch status data" },
      { status: 500 },
    );
  }
}
