import { ffmpeg } from '../../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const content = q.msg || q

    if (q.mtype !== 'stickerMessage' && !/webp/.test(content.mimetype || '')) {
        return RaplyGwe(`Balas stiker dengan perintah *${usedPrefix + command}*`)
    }
    if (content.isAnimated) {
        return RaplyGwe('Stiker animasi belum didukung, balas stiker biasa (non-animasi).')
    }

    await m.react('🕒')
    try {
        const buffer = await q.download()
        if (!buffer) throw new Error('Gagal mengunduh stiker')
        const png = await ffmpeg(buffer, ['-frames:v', '1'], 'webp', 'png')
        await conn.sendMessage(m.chat, { image: png, caption: '✅ Berhasil diubah ke gambar.' }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe('Gagal mengubah stiker ke gambar.')
    }
}

handler.help = ['toimg']
handler.tags = ['maker']
handler.command = /^(toimg|toimage)$/i

export default handler
