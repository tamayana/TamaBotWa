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

    await m.react('🕒')
    try {
        const buffer = await q.download()
        if (!buffer) throw new Error('Gagal mengunduh media')

        await conn.sendSticker(m.chat, buffer, m, {
            mime,
            packname: config.botName,
            author: m.pushName || config.ownerName
        })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe('Gagal membuat stiker. Pastikan media valid dan ffmpeg tersedia.')
    }
}

handler.help = ['sticker']
handler.tags = ['maker']
handler.command = /^(s|sticker|stiker)$/i

export default handler
