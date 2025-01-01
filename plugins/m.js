const axios = require("axios");
const config = require("../config");
const { cmd, commands } = require("../command");
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
} = require("../lib/functions");

cmd(
    {
        pattern: "movie",
        alias: ["movi", "tests"],
        use: ".movie <query>",
        react: "🔎",
        desc: "Moive downloader",
        category: "movie",
        filename: __filename,
    },

    async (conn, mek, m, { from, quoted, args, q, reply }) => {
        try {
            let sadas = await fetchJson(
                `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${q}`,
            );
            const msg = `*🎥 MOVIE SEARCH 🎥*`;

            if (sadas.data.length < 1)
                return await conn.sendMessage(
                    from,
                    { text: "🚩 *I couldn't find anything :(*" },
                    { quoted: mek },
                );

            let text = `${msg}\n\n`;
            sadas.data.forEach((v, index) => {
                text += `${index + 1}. ${v.Title}\nLink: ${v.Link}\n\n`;
            });

            await conn.sendMessage(from, { text }, { quoted: mek });
        } catch (e) {
            console.log(e);
            await conn.sendMessage(
                from,
                { text: "🚩 *Error !!*" },
                { quoted: mek },
            );
        }
    },
);

cmd(
    {
        pattern: "infodl",
        alias: ["mdv"],
        use: ".moviedl <url>",
        react: "🎥",
        desc: "download movies from sinhalasub.lk",
        filename: __filename,
    },

    async (conn, mek, m, { from, q, reply }) => {
        try {
            if (!q) return reply("🚩 *Please give me a url*");

            let sadas = await fetchJson(
                `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${q}`,
            );

            if (!sadas || sadas.length < 1)
                return await conn.sendMessage(
                    from,
                    { text: "🚩 *I couldn't find anything :(*" },
                    { quoted: mek },
                );

            let text = `🎥  MOVIE DOWNLOADER 🎥\n\n*Title:* ${sadas.title}\n*Release:* ${sadas.date}\n*Rating:* ${sadas.rating}\n*Runtime:* ${sadas.duration}\n*Director:* ${sadas.author}\n*Country:* ${sadas.country}\n\nDownload Links:\n`;

            sadas.downloadLinks.forEach((v) => {
                text += `- ${v.quality} (${v.size}): ${v.link}\n`;
            });

            await conn.sendMessage(from, { text }, { quoted: mek });
        } catch (e) {
            console.log(e);
            await conn.sendMessage(
                from,
                { text: "🚩 *Error !!*" },
                { quoted: mek },
            );
        }
    },
);

cmd(
    {
        pattern: "fit",
        react: "📥",
        dontAddCommandList: true,
        filename: __filename,
    },
    async (conn, mek, m, { from, q, reply }) => {
        if (!q) {
            return await reply("*Please provide a direct URL!*");
        }

        const [mediaUrl, fileName] = q.split("±").map((item) => item.trim());

        if (!mediaUrl || !mediaUrl.startsWith("http")) {
            return await reply("*Invalid URL provided!*");
        }

        // Function to fetch the file with retry logic
        const fetchFile = async (url) => {
            try {
                const axios = require("axios");
                const response = await axios.get(url, {
                    responseType: "arraybuffer",
                    timeout: 60000, // 60 seconds timeout
                });
                return response;
            } catch (error) {
                if (error.code === "ECONNABORTED") {
                    console.log("Request timed out, retrying...");
                    return fetchFile(url); // Retry
                }
                throw error;
            }
        };

        try {
            // Fetch file data with retry logic
            const response = await fetchFile(mediaUrl);
            const mediaBuffer = Buffer.from(response.data, "binary");

            // Calculate file size in MB
            const fileSizeInMB = (mediaBuffer.length / (1024 * 1024)).toFixed(
                2,
            );

            const path = require("path");
            const fileExtension = path.extname(mediaUrl) || ".file"; // Default to .file if no extension
            const finalFileName = `${fileName || "Downloaded_File"}${fileExtension}`;
            const mimeType =
                response.headers["content-type"] || "application/octet-stream";

            // Send document
            const message = {
                document: mediaBuffer,
                caption: `🎬 *${fileName || "File"}*\n\n*File Size:* ${fileSizeInMB} MB\n\n_Provided by DARK SHUTER_ 🎬`,
                mimetype: mimeType,
                fileName: finalFileName,
            };

            await conn.sendMessage(from, message, { quoted: mek });

            // Success reaction
            await conn.sendMessage(from, {
                react: { text: "✔️", key: mek.key },
            });
        } catch (error) {
            console.error("Error fetching or sending the file:", error.message);
            console.error(
                "Error details:",
                error.response ? error.response.data : error,
            );
            await reply(
                "*An error occurred while processing the file. Please try again!*",
            );
        }
    },
);
