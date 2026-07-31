export async function sendTelegramAlert(chatId: string, message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.error("TELEGRAM_BOT_TOKEN is not defined");
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
                disable_notification: false,
            })
        })

        const data = await response.json();

        if (!data.ok) {
            console.error("Telegram Error:", data.description);
            return false;
        }

        return true

    } catch (error) {
        console.error("Telegram alert sent failed", error);
    }
}
