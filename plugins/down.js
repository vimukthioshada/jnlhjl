const axios = require('axios');
const { File } = require('megajs');
const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')
const { igdl } = require('ruhend-scraper')
const fetch = require('node-fetch')

var needus = "🚩*Please Give Me GitHub Repo URL!*" 
var cantf = "🚩 *I Can't Find This Repo!*" 

cmd({
    pattern: "mega",
    react: "🍟",
    alias: ["megadl","meganz"],
    desc: "urlneed",
    category: "download",
    use: '.mega url',
    filename: __filename
}, 
    async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return await reply('*Please provide a mega.nz URL!*');
    }

    try {
        const file = File.fromURL(q)
        await file.loadAttributes()
        //if (file.size >= 2048 * 1024 * 1024) return reply(`File size exeeded...\nMaximum Upload Size Is ${config.MAX_SIZ} MB`)
        const data = await file.downloadBuffer();
        
        if (/mp4/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "video/mp4", filename: `${file.name}` }, { quoted: mek });
        } else if (/pdf/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/pdf", filename: `${file.name}` }, { quoted: mek });
        } else if (/zip/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/zip", filename: `${file.name}` }, { quoted: mek });
        } else if (/rar/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/x-rar-compressed", filename: `${file.name}` }, { quoted: mek });
        } else if (/7z/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/x-7z-compressed", filename: `${file.name}` }, { quoted: mek });
        } else if (/jpg|jpeg/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "image/jpeg", filename: `${file.name}` }, { quoted: mek });
        } else if (/png/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "image/png", filename: `${file.name}` }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { document: data, mimetype: "application/octet-stream", filename: `${file.name}` }, { quoted: mek })
        }
        
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
});


cmd({
    pattern: "gitclone",
    alias: ["gitdl"],
    react: '💫',
    desc: "Download git repos",
    category: "download",
    use: '.gitclone <repo link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
      if (!q) return await  reply(needus)
      let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
      let linknya = q
      if (!regex1.test(linknya)) return reply("🚩*Please Give Me Valid GitHub Repo Link!*");
      let [, user, repo] = q.match(regex1) || []
      repo = repo.replace(/.git$/, '')
      let url = `https://api.github.com/repos/${user}/${repo}/zipball`
      let filename = (await fetch(url, {
         method: 'HEAD'
      })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
      let wm = `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪʟᴀ ʟᴏᴄʜᴀɴᴀ*`
      await conn.sendMessage(from, { document: { url: url }, mimetype: 'application/zip', fileName: filename, caption: wm}, { quoted: mek })
} catch (e) {
reply(cantf)
console.log(e)
}
})

cmd({

    pattern: "ig",
    alias: ["insta","igdl"],
    desc: "To get the instragram.",
    react: "📑",
    use: '.ig < Link >',
    category: "download",
    filename: __filename

},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{
    
if (!q) return m.reply(`Please Give Me a vaild Link...`);
m.react('⬇️')

         let res = await igdl(q);
        
         let data = await res.data;
         for (let i = 0; i < 20; i++) {
            let media = data[i];
            let downloadurl = media.url
             m.react('⬆️')
            await conn.sendMessage(from,{video: {url:downloadurl},mimetype:"video/mp4",caption: config.FOOTER},{quoted:mek})
             m.react('✅')
         }

}catch(e){
console.log(e)
}
})

cmd({
    pattern: "fb",
    alias: ["fbdl","fb2"],
    react: "🍧",
    desc: "",
    category: "download",
    use: '.fb < url >',
    filename: __filename
},
async(conn, mek, m,{from, quoted, reply, q }) => {
try{
  
if(!q) return await reply("Please give me tiktok url");
  if(!q.includes('facebook.com')) return await reply("This url is invalid");
  
const fb2 = await fetchJson(`https://www.dark-yasiya-api.site/download/fbdl1?url=${q}`);


     let desc = ` *BLACK LEAUGE MD FB DOWNLOADER...⚙️*

*Reply This Message With Option*

*1 Download FB Video In HD*
*2 Download FB Video In SD*

> *𝙋𝙊𝙒𝙀𝙍𝘿 𝘽𝙔 𝘼𝙉𝙄𝙇𝘼 𝙇𝙊𝘾𝙃𝘼𝙉𝘼*`;

 
        const vv = await conn.sendMessage(from, { image: { url: "https://telegra.ph/file/3f7249eb429c8211cbba3.jpg"}, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
   // SEND HD VIDEO
await conn.sendMessage(from, { video: { url: fb2.result.sd }, mimetype: "video/mp4", caption: "> *𝙋𝙊𝙒𝙀𝙍𝘿 𝘽𝙔 𝘼𝙉𝙄𝙇𝘼 𝙇𝙊𝘾𝙃𝘼𝙉𝘼*" }, { quoted: mek });
                        break;
                        case'2':
await conn.sendMessage(from, { video: { url: fb2.result.hd }, mimetype: "video/mp4", caption: "> *𝙋𝙊𝙒𝙀𝙍𝘿 𝘽𝙔 𝘼𝙉𝙄𝙇𝘼 𝙇𝙊𝘾𝙃𝘼𝙉𝘼*" }, { quoted: mek });
                        break;
                        default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });
  
} catch (e) {
console.log(e)
reply(e)
}
});


cmd({
    pattern: "tiktok",
    alias: ["tt","ttdown"],
    react: "🎥",
    desc: "",
    category: "download",
    use: '.tiktok < url >',
    filename: __filename
},
async(conn, mek, m,{from, quoted, reply, q }) => {
try{
  
if(!q) return await reply("Please give me tiktok url");
  if(!q.includes('tiktok.com')) return await reply("This url is invalid");
  
const tiktok = await fetchJson(`https://www.dark-yasiya-api.site/download/tiktok?url=${q}`);
  

 
    let desc = ` *BLACK LEAUGE MD TIKTOK DOWNLOADER...⚙️*

*Reply This Message With Option*

*1 Download tiktok video water mark*
*2 Download tiktok Video In SD*
*3 Download tiktok audio*

> *𝙋𝙊𝙒𝙀𝙍𝘿 𝘽𝙔 𝘼𝙉𝙄𝙇𝘼 𝙇𝙊𝘾𝙃𝘼𝙉𝘼*`;



        const vv = await conn.sendMessage(from, { image: { url: "https://telegra.ph/file/3f7249eb429c8211cbba3.jpg"}, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':

// SEND WATER MARK VIDEO
await conn.sendMessage(from, { video: { url: tiktok.result.wmVideo }, mimetype: "video/mp4", caption: `${tiktok.result.title}\n\nWATERMARK VIDEO ✅` }, { quoted: mek });
                    break;
                    case'2':
// SEND HD VIDEO
await conn.sendMessage(from, { video: { url: tiktok.result.hdVideo }, mimetype: "video/mp4", caption: `${tiktok.result.title}\n\nNO-WATERMARK VIDEO ✅` }, { quoted: mek });
                     break;
                     case'3':
// SEND AUDIO
await conn.sendMessage(from, { audio: { url: tiktok.result.sound }, mimetype: "audio/mpeg" }, { quoted: mek });
                     break;
                     default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });
  
} catch (e) {
console.log(e)
reply(e)
}
});
