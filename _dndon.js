const https = require('https');

module.exports = async (body) => {

    const GUILD_ID = process.env.GUILD_ID;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
        console.error("BOT_TOKEN is missing");
        return {
            statusCode: 500,
            body: "BOT_TOKEN environment variable not set"
        };
    }

    const usersToRename = [
        { id: '432610292342587392', nickname: 'temp' }, // change as needed
    ];

    const updateNickname = (userId, nickname) => {
        return new Promise((resolve, reject) => {

            const data = JSON.stringify({ nick: nickname });

            const options = {
                hostname: 'discord.com',
                path: `/api/v10/guilds/${GUILD_ID}/members/${userId}`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bot ${BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            const req = https.request(options, (res) => {
                let response = '';

                res.on('data', chunk => response += chunk);

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve();
                    } else {
                        reject(`Status: ${res.statusCode} | ${response}`);
                    }
                });
            });

            req.on('error', (err) => {
                reject(err.message);
            });

            req.write(data);
            req.end();
        });
    };

    let responseMessage = "## Nickname Updates:\n";

    try {
        for (const user of usersToRename) {
            await updateNickname(user.id, user.nickname);
            responseMessage += `> <@${user.id}> -> **${user.nickname}**\n`;
        }
    } catch (err) {
        console.error("Nickname update failed:", err);
        responseMessage = `Failed to update nickname.\n${err}`;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: { content: responseMessage }
        }),
    };
};