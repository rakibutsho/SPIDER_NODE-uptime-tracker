import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const monitorId = parseInt(id);

        if (isNaN(monitorId)) {
            return NextResponse.json({ error: 'Invalid monitor ID' }, { status: 400 });
        }

        const monitor = await prisma.monitor.findFirst({
            where: {
                id: monitorId,
                userId: session.user.id,
            },
            include: {
                pings: {
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                },
                incidents: {
                    orderBy: { startedAt: 'desc' },
                    take: 20,
                }
            }
        });

        if (!monitor) {
            return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
        }

        return NextResponse.json({ monitor }, { status: 200 });

    } catch (error) {
        console.error('Error fetching monitor details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
