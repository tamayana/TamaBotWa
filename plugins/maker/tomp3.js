import { toAudio } from '../../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    const content = q.msg || q

    if (!/video|audio/.test(mime)) {
        return RaplyGwe(`Balas video / audio dengan perintah *${usedPrefix + command}*`)
    }
    // PENGAMAN BARU: Max 5 menit! Kalo lebih, tolak!
    if ((content.seconds || 0) > 300) return RaplyGwe('Durasi maksimal 5 menit anjing! Video lu kepanjangan!')

    await m.react('🕒').catch(()=>{})
    try {
        const buffer = await q.download()
        if (!buffer || !buffer.length) throw new Error('Gagal mengunduh media')

        // PENGAMAN BARU: Max 20MB!
        if (buffer.length > 20 * 1024 * 1024) return RaplyGwe('File kegedean anjing! Max 20MB aja buat MP3!')

        const ext = mime.split(';')[0].split('/')[1] || 'mp4'
        const audio = await toAudio(buffer, ext)
        if (!audio || !audio.length) throw new Error('Gagal convert audio')

        await conn.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg' }, { quoted: m })
        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[tomp3 TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe('Gagal mengubah ke MP3, coba lagi anjing! Pastikan media punya suara.')
    }
}

handler.help = ['tomp3']
handler.tags = ['maker']
handler.command = /^(tomp3|toaudio)$/i

export default handler
