import { toPTT } from '../../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    const content = q.msg || q

    if (!/video|audio/.test(mime)) {
        return RaplyGwe(`Balas video / audio dengan perintah *${usedPrefix + command}*`)
    }
    // PENGAMAN BARU: Max 5 menit! Voice note gak usah panjang-panjang!
    if ((content.seconds || 0) > 300) return RaplyGwe('Durasi maksimal 5 menit anjing! Video lu kepanjangan!')

    await m.react('🕒').catch(()=>{})
    try {
        const buffer = await q.download()
        if (!buffer || !buffer.length) throw new Error('Gagal mengunduh media')

        // PENGAMAN BARU: Max 20MB!
        if (buffer.length > 20 * 1024 * 1024) return RaplyGwe('File kegedean anjing! Max 20MB aja buat VN!')

        const ext = mime.split(';')[0].split('/')[1] || 'mp4'
        const audio = await toPTT(buffer, ext)
        if (!audio || !audio.length) throw new Error('Gagal convert audio')

        await conn.sendMessage(m.chat, { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m })
        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[tovn TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe('Gagal mengubah ke voice note, coba lagi anjing! Pastikan media punya suara.')
    }
}

handler.help = ['tovn']
handler.tags = ['maker']
handler.command = /^(tovn|tovoice)$/i

export default handler
