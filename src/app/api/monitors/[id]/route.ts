import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";


interface RouteParams {
    params: Promise<{ id: string }>
}

// ----------------------------------------------------
// 1. GET SINGLE MONITOR DETAILS (GET)
// ----------------------------------------------------

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const monitorId = parseInt(id, 10);
        if (isNaN(monitorId)) {
            return NextResponse.json({ error: "Invalid monitor ID" }, { status: 400 });
        }

        const monitor = await prisma.monitor.findUnique({
            where: { id: monitorId, userId: session.user.id }
        });

        if (!monitor) {
            return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
        }

        return NextResponse.json({ monitor }, { status: 200 })
    } catch (error) {
        console.error("Get Single Monitor Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch monitor" },
            { status: 500 }
        )
    }
}

// ----------------------------------------------------
// 2. UPDATE MONITOR (PATCH)
// ----------------------------------------------------

export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const monitorId = parseInt(id, 10);
        if (isNaN(monitorId)) {
            return
        }

        let body: any = {};
        try {
            body = await req.json();
        } catch (e) {
            // Ignore JSON parse error if body is empty (manual ping)
        }
        
        const { name, url, interval, isActive } = body;

        //check if the monitor exists and belong to the user
        const existingMonitor = await prisma.monitor.findFirst({
            where: { id: monitorId, userId: session.user.id },
        })

        if (!existingMonitor) {
            return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
        }

        const updateData: Record<string, any> = {};

        if (name !== undefined) updateData.name = name.trim();
        if (url !== undefined) {
            try {
                new URL(url);
                updateData.url = url.trim();
            } catch (_) {
                return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
            }
        }
        if (interval) updateData.interval = parseInt(interval);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        const updatedMonitor = await prisma.monitor.update({
            where: { id: monitorId },
            data: updateData,
        });

        return NextResponse.json(
            { message: "Monitor updated successfully", monitor: updatedMonitor },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update Monitor Error:", error);
        return NextResponse.json(
            { error: "Failed to update monitor" },
            { status: 500 }
        )

    }
}


// ----------------------------------------------------
// 3. DELETE MONITOR (DELETE)
// ----------------------------------------------------

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const monitorId = parseInt(id, 10);
        if (isNaN(monitorId)) {
            return
        }

        const existingMonitor = await prisma.monitor.findFirst({
            where: { id: monitorId, userId: session.user.id },
        });

        if (!existingMonitor) {
            return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
        }

        await prisma.monitor.delete({
            where: { id: monitorId },
        });

        return NextResponse.json(
            { message: 'Monitor deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete Monitor Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete monitor' },
            { status: 500 }
        );
    }
}