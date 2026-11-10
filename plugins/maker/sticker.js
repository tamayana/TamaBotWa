import config from '../../config.js'

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const content = q.msg || q
    const mime = content.mimetype || ''

    if (!/image|video|webp/.test(mime)) {
        return RaplyGwe(`Kirim / balas gambar, video, atau GIF dengan perintah *${usedPrefix + command}*`)
    }
    if (/video/.test(mime) && (content.seconds || 0) > 10) {
        return RaplyGwe('Durasi video maksimal 10 detik.')
    }

    await m.react('🕒').catch(()=>{})
    try {
        const buffer = await q.download()
        if (!buffer || !buffer.length) throw new Error('Gagal mengunduh media')

        // PENGAMAN BARU: Max 10MB buat gambar, 15MB buat video!
        const maxSize = /video/.test(mime) ? 15 * 1024 * 1024 : 10 * 1024 * 1024
        if (buffer.length > maxSize) return RaplyGwe(`File kegedean anjing! Max ${/video/.test(mime) ? '15MB' : '10MB'} aja buat stiker!`)

        await conn.sendSticker(m.chat, buffer, m, {
            mime,
            packname: global.stickpack || config.botName || 'TAMA-ID',
            author: global.stickauth || m.pushName || config.ownerName || 'TAMA-ID'
        })
        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[sticker TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe('Gagal membuat stiker, coba lagi anjing! Pastikan media valid dan ffmpeg tersedia.')
    }
}

handler.help = ['sticker']
handler.tags = ['maker']
handler.command = /^(s|sticker|stiker)$/i

export default handler
