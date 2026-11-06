import { toAudio } from '../../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video|audio/.test(mime)) {
        return RaplyGwe(`Balas video / audio dengan perintah *${usedPrefix + command}*`)
    }

    await m.react('🕒')
    try {
        const buffer = await q.download()
        if (!buffer) throw new Error('Gagal mengunduh media')
        const ext = mime.split(';')[0].split('/')[1] || 'mp4'
        const audio = await toAudio(buffer, ext)
        await conn.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg' }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe('Gagal mengubah ke MP3. Pastikan media punya suara.')
    }
}

handler.help = ['tomp3']
handler.tags = ['maker']
handler.command = /^(tomp3|toaudio)$/i

export default handler
