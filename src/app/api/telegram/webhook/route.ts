import { prisma } from "@/lib/prisma";
import { sendTelegramAlert } from "@/lib/telegram";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const body = await req.json()

        // if message is came check it

        if (body.message && body.message.text) {
            const chatId = body.message.chat.id.toString();
            const text = body.message.text;


            if (text.startsWith('/start ')) {
                const userId = text.split(' ')[1];


                if (userId) {
                    const user = await prisma.user.update({
                        where: { id: userId },
                        data: { telegramChatId: chatId }
                    })

                    // ২. টেলিগ্রামে কনফার্মেশন মেসেজ পাঠানো
                    await sendTelegramAlert(
                        chatId,
                        `🎉 <b>Account Connected!</b>\n\nHello <b>${user.name || 'User'
                        }</b>, your Telegram account is now successfully linked to PluseGuard.`
                    );
                }
            }
        }
        return NextResponse.json({ ok: true }, { status: 200 });

    } catch (error) {
        console.error('Telegram Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}

