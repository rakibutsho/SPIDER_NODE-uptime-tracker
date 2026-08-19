import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { runCronChecks } from "@/lib/cron-logic";
import { flushBatches } from "@/lib/db-batcher";

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
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
            return NextResponse.json({ error: "Monitor not found or unauthorized" }, { status: 404 })
        }

        // Force check specifically for this monitor
        const { message, result } = await runCronChecks(true, monitorId);

        // Ensure we flush immediately so the UI sees the updated status
        await flushBatches();

        return NextResponse.json(
            { message: "Monitor checked successfully", result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Check Monitor Error:", error);
        return NextResponse.json(
            { error: "Failed to check monitor" },
            { status: 500 }
        )
    }
}
