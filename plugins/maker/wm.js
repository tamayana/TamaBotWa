import config from '../../config.js'
import { addExif, isWebp } from '../../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const content = q.msg || q
    const isSticker = q.mtype === 'stickerMessage' || /webp/.test(content.mimetype || '')

    if (!isSticker) {
        return RaplyGwe(`Balas stiker dengan perintah:\n*${usedPrefix + command}* packname|author\n\nContoh: *${usedPrefix + command}* Yorumi|Fyzz`)
    }

    const [packRaw, ...authRaw] = (text || '').split('|')
    const packname = (packRaw || '').trim() || config.botName
    const author = authRaw.join('|').trim() || m.pushName || config.ownerName

    await m.react('🕒')
    try {
        const buffer = await q.download()
        if (!buffer || !isWebp(buffer)) throw new Error('Stiker tidak valid')

        const sticker = await addExif(buffer, { packname, author })
        await conn.sendMessage(m.chat, { sticker }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe('Gagal mengganti watermark stiker. Pastikan yang dibalas adalah stiker.')
    }
}

handler.help = ['wm <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^(wm|swm|take)$/i

export default handler
