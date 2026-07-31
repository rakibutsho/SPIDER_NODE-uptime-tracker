import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


// ----------------------------------------------------
// 1. GET ALL MONITORS FOR LOGGED-IN USER (GET)
// ----------------------------------------------------
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const monitors = await prisma.monitor.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ monitors }, { status: 200 });
  } catch (error) {
    console.error("Featch Monitors Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitors" },
      { status: 500 }
    )
  }
}

// ----------------------------------------------------
// 2. CREATE A NEW MONITOR (POST)
// ----------------------------------------------------

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthirized" }, { status: 401 })
    }

    const body = await req.json();
    const { name, url, interval } = body;

    // Field Validation
    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      )
    }

    // URL Format Validation

    try {
      new URL(url);
    } catch (_) {
      return NextResponse.json(
        { error: 'Invalid URL format (e.g., https://example.com)' },
        { status: 400 }
      )
    }

    const newMonitor = await prisma.monitor.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        interval: interval ? parseInt(interval) : 5,
        userId: session.user.id,
        status: "PENDING"
      }
    })

    return NextResponse.json(
      { message: "Monitor listed successfully", monitor: newMonitor },
      { status: 201 }
    )

  } catch (error) {
    console.error("Create Monitor Error", error);
    return NextResponse.json(
      { error: "Failed to create monitor" },
      { status: 500 }
    );

  }

}