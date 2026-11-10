let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('Reply foto/video sekali liat nya dulu bung! Terus ketik *.rvo*');

    let q = m.quoted;
    let msg = q.message;

    // Cek viewOnce V1 & V2
    let viewOnce = msg?.viewOnceMessage || msg?.viewOnceMessageV2 || msg?.viewOnceMessageV2Extension;
    if (!viewOnce) return m.reply('Ini bukan foto sekali liat bung!');

    let innerMsg = viewOnce.message;
    let type = Object.keys(innerMsg)[0];
    let media = innerMsg[type];

    m.reply('Tunggu bung, gua ambil foto nya... 🔥');

    try {
        let buffer = await q.download();
        // Kalo download gagal, pake cara manual
        if (!buffer) {
            const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
            let stream = await downloadContentFromMessage(media, type.replace('Message', ''));
            buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
        }

        let caption = `*BERHASIL BUNG! 🔥*\n\n> *By:* TamaBotWa - Mr.Tamaaa\n> *Dari Pontianak!*`;

        if (type === 'imageMessage') {
            await conn.sendMessage(m.chat, { image: buffer, caption: caption }, { quoted: m });
        } else if (type === 'videoMessage') {
            await conn.sendMessage(m.chat, { video: buffer, caption: caption }, { quoted: m });
        } else {
            m.reply('Bukan foto/video bung!');
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal bung! Foto nya udah kebuka duluan!');
    }
}

handler.help = ['rvo'];
handler.tags = ['tools'];
handler.command = /^(rvo|readviewonce|reveal)$/i;

module.exports = handler;
