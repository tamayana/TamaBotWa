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

    await m.react('🕒').catch(()=>{})
    try {
        const buffer = await q.download()
        if (!buffer || !buffer.length) throw new Error('Gagal mengunduh stiker')

        // PENGAMAN BARU: Max 5MB!
        if (buffer.length > 5 * 1024 * 1024) return RaplyGwe('Stiker kegedean anjing! Max 5MB aja!')

        const png = await ffmpeg(buffer, ['-frames:v', '1'], 'webp', 'png')
        if (!png || !png.length) throw new Error('Gagal convert stiker')

        await conn.sendMessage(m.chat, { image: png, caption: '✅ Berhasil diubah ke gambar.\n└╼ Powered By : TAMA-ID' }, { quoted: m })
        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[toimg TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe('Gagal mengubah stiker ke gambar, coba lagi anjing!')
    }
}

handler.help = ['toimg']
handler.tags = ['maker']
handler.command = /^(toimg|toimage)$/i

export default handler
