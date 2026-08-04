import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// ----------------------------------------------------
// GET ALL INCIDENTS FOR LOGGED-IN USER
// ----------------------------------------------------
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incidents = await prisma.incident.findMany({
      where: {
        monitor: {
          userId: session.user.id,
        },
      },
      include: {
        monitor: {
          select: { id: true, name: true, url: true, status: true },
        },
      },
      orderBy: { startedAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ incidents }, { status: 200 });
  } catch (error) {
    console.error("Fetch Incidents Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 },
    );
  }
}
