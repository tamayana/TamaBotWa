let handler = async (m, { conn, usedPrefix, command }) => {
    const quoted = m.quoted

    if (!quoted) {
        return m.reply(`Balas pesan *View Once* (sekali lihat) dengan perintah *${usedPrefix + command}*`)
    }

    try {
        const buffer = typeof quoted.download === 'function' ? await quoted.download() : null
        if (!Buffer.isBuffer(buffer)) {
            return m.reply('Gagal membaca media. Pastikan kamu membalas pesan View Once (foto, video, atau audio).')
        }

        const mime = quoted.mimetype || ''
        const caption = quoted.caption || quoted.text || ''
        const label = caption ? `[RVO]\n${caption}` : '*𝖡𝖾𝗋𝗁𝖺𝗌𝗂𝗅 𝖣𝗂 𝖱𝗏𝗈 𝖢𝗂𝗄*'

        if (/video/i.test(mime)) {
            await conn.sendMessage(m.chat, { video: buffer, caption: label, mimetype: mime }, { quoted: m })
        } else if (/audio/i.test(mime)) {
            await conn.sendMessage(m.chat, { audio: buffer, mimetype: mime, ptt: false }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { image: buffer, caption: label, mimetype: mime || 'image/jpeg' }, { quoted: m })
        }
    } catch (e) {
        console.error('[rvo]', e)
        await m.reply(`❌ *Gagal:* ${e.message || e}`)
    }
}

handler.help = ['rvo']
handler.tags = ['tools']
handler.command = /^(rvo|readviewonce)$/i

export default handler
