import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendTelegramAlert } from "@/lib/telegram";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // check user telegram id

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { telegramChatId: true, name: true },
        });


        if (!user?.telegramChatId) {
            return NextResponse.json(
                { error: 'Telegram Chat ID is not configured in your profile' },
                { status: 400 }
            );
        }

        const message = `
🚀 <b>Test Notification</b>

Hello <b>${user.name || 'User'}</b>! 
Your Telegram notification setup is working perfectly. You will receive real-time alerts whenever your websites go down or recover!
    `.trim();

        const isSent = await sendTelegramAlert(user.telegramChatId, message);

        if (!isSent) {
            return NextResponse.json(
                { error: 'Failed to send message. Please verify your Telegram Chat ID.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Test alert sent successfully to your Telegram!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Test Telegram Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}