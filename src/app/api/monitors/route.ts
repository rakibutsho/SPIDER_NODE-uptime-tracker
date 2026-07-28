import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const monitors = await prisma.monitor.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ monitors });
  } catch (error) {
    console.error("GET /api/monitors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitors" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    let { name, url } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Monitor name and URL are required" },
        { status: 400 }
      );
    }

    name = name.trim();
    url = url.trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newMonitor = await prisma.monitor.create({
      data: {
        name,
        url,
        status: "UP",
        lastChecked: new Date(),
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Monitor created successfully", monitor: newMonitor },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/monitors error:", error);
    return NextResponse.json(
      { error: "Failed to create monitor" },
      { status: 500 }
    );
  }
}
