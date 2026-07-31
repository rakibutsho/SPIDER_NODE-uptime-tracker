import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME; // e.g. my_uptime_tracker_bot

        if (!botUsername) {
            return NextResponse.json(
                { error: 'Telegram Bot Username is not defined' },
                { status: 500 }
            );
        }

        // ইউজারের ID কে payload হিসেবে পাঠানো
        const connectLink = `https://t.me/${botUsername}?start=${session.user.id}`;

        return NextResponse.json({ link: connectLink }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate connect link' },
            { status: 500 }
        );
    }
}