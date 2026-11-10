import config from '../../config.js'
import { addExif, isWebp } from '../../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const content = q.msg || q
    const isSticker = q.mtype === 'stickerMessage' || /webp/.test(content.mimetype || '')

    if (!isSticker) {
        return RaplyGwe(`Balas stiker dengan perintah:\n*${usedPrefix + command}* packname|author\n\nContoh: *${usedPrefix + command}* Tama|MCTama`)
    }

    const [packRaw, ...authRaw] = (text || '').split('|')
    let packname = (packRaw || '').trim() || config.botName || 'TAMA-ID'
    let author = authRaw.join('|').trim() || m.pushName || config.ownerName || 'TAMA-ID'

    // PENGAMAN BARU: Max 30 karakter! Biar gak jebol!
    if (packname.length > 30) packname = packname.slice(0, 30)
    if (author.length > 30) author = author.slice(0, 30)

    await m.react('🕒').catch(()=>{})
    try {
        const buffer = await q.download()
        if (!buffer || !buffer.length || !isWebp(buffer)) throw new Error('Stiker tidak valid')

        // PENGAMAN BARU: Max 5MB!
        if (buffer.length > 5 * 1024 * 1024) return RaplyGwe('Stiker kegedean anjing! Max 5MB aja!')

        const sticker = await addExif(buffer, { packname, author })
        if (!sticker || !sticker.length) throw new Error('Gagal bikin stiker')
        await conn.sendMessage(m.chat, { sticker }, { quoted: m })
        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[wm TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe('Gagal mengganti watermark stiker, coba lagi anjing! Pastikan yang dibalas adalah stiker.')
    }
}

handler.help = ['wm <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^(wm|swm|take)$/i

export default handler
