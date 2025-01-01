const fs = require("fs");
const path = require("path");
const { readEnv } = require("../lib/database");
const { cmd, commands } = require("../command");

// Helper function to safely read and parse JSON
const readJSONFile = (filePath) => {
    try {
        const rawData = fs.readFileSync(filePath, "utf8").trim();
        return JSON.parse(rawData);
    } catch (e) {
        console.error(`Error parsing JSON in file ${filePath}:`, e.message);
        return null; // Return null if parsing fails
    }
};

// Auto Voice
cmd(
    {
        on: "body",
    },
    async (conn, mek, m, { from, body }) => {
        const filePath = path.join(__dirname, "../my_data/autovoice.json");
        const data = readJSONFile(filePath);
        if (!data) return; // Exit if JSON is invalid

        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                const config = await readEnv();
                if (config.AUTO_VOICE === "true") {
                    await conn.sendPresenceUpdate("recording", from);
                    await conn.sendMessage(
                        from,
                        {
                            audio: { url: data[text] },
                            mimetype: "audio/mpeg",
                            ptt: true,
                        },
                        { quoted: mek },
                    );
                }
            }
        }
    },
);

// Auto Sticker
cmd(
    {
        on: "body",
    },
    async (conn, mek, m, { from, body }) => {
        const filePath = path.join(__dirname, "../my_data/autosticker.json");
        const data = readJSONFile(filePath);
        if (!data) return; // Exit if JSON is invalid

        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                const config = await readEnv();
                if (config.AUTO_STICKER === "true") {
                    await conn.sendMessage(
                        from,
                        {
                            sticker: { url: data[text] },
                            package: "SILENT LOVER",
                        },
                        { quoted: mek },
                    );
                }
            }
        }
    },
);

// Auto Reply
cmd(
    {
        on: "body",
    },
    async (conn, mek, m, { from, body }) => {
        const filePath = path.join(__dirname, "../my_data/autoreply.json");
        const data = readJSONFile(filePath);
        if (!data) return; // Exit if JSON is invalid

        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                const config = await readEnv();
                if (config.AUTO_REPLY === "true") {
                    await m.reply(data[text]);
                }
            }
        }
    },
);
