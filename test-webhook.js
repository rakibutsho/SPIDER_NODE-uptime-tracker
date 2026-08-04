const https = require('https');
const http = require('http');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;


const getUpdatesUrl = `https://api.telegram.org/bot${TOKEN}/getUpdates`;

https.get(getUpdatesUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        if (json.ok && json.result.length > 0) {
            console.log(`Found ${json.result.length} updates.`);
            json.result.forEach(update => {
                if (update.message) {
                    const postData = JSON.stringify(update);
                    const req = http.request({
                        hostname: 'localhost',
                        port: 3000,
                        path: '/api/telegram/webhook',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData)
                        }
                    }, (res2) => {
                        console.log(`Forwarded update ${update.update_id}: Status ${res2.statusCode}`);
                    });
                    req.write(postData);
                    req.end();
                }
            });
            // Mark updates as read by fetching with offset
            const lastUpdateId = json.result[json.result.length - 1].update_id;
            https.get(`${getUpdatesUrl}?offset=${lastUpdateId + 1}`);
        } else {
            console.log('No pending updates found.');
        }
    });
});
