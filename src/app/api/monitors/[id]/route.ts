import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const monitorId = parseInt(id, 10);

    if (isNaN(monitorId)) {
      return NextResponse.json(
        { error: "Invalid monitor ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure monitor belongs to the authenticated user
    const existingMonitor = await prisma.monitor.findFirst({
      where: { id: monitorId, userId: user.id },
    });

    if (!existingMonitor) {
      return NextResponse.json(
        { error: "Monitor not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.monitor.delete({
      where: { id: monitorId },
    });

    return NextResponse.json({ message: "Monitor deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/monitors/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete monitor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const monitorId = parseInt(id, 10);

    if (isNaN(monitorId)) {
      return NextResponse.json(
        { error: "Invalid monitor ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingMonitor = await prisma.monitor.findFirst({
      where: { id: monitorId, userId: user.id },
    });

    if (!existingMonitor) {
      return NextResponse.json(
        { error: "Monitor not found or unauthorized" },
        { status: 404 }
      );
    }

    // Perform a real HTTP ping check to update status
    let newStatus = "DOWN";
    try {
      const pingRes = await fetch(existingMonitor.url, {
        method: "HEAD",
        cache: "no-store",
        headers: { "User-Agent": "PulseGuard-UptimeChecker/1.0" },
      });
      if (pingRes.ok || pingRes.status < 400) {
        newStatus = "UP";
      }
    } catch {
      newStatus = "DOWN";
    }

    const updatedMonitor = await prisma.monitor.update({
      where: { id: monitorId },
      data: {
        status: newStatus,
        lastChecked: new Date(),
      },
    });

    return NextResponse.json({ monitor: updatedMonitor });
  } catch (error) {
    console.error("PATCH /api/monitors/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to check monitor status" },
      { status: 500 }
    );
  }
}
