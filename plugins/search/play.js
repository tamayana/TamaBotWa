import axios from 'axios'
import config from '../../config.js'
import { toAudio } from '../../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Kirim judul lagu!\nContoh: *${usedPrefix + command}* Cikadap`)

    await m.react('⌛')

    try {
        const { data } = await axios.get('https://api.ikyyxd.my.id/search/ytplayv2', {
            params: { q: text },
            timeout: 60000
        })

        const res = data?.result
        if (!data?.status || !res?.audio?.url) {
            await m.react('❌')
            return RaplyGwe('*Lagu tidak ditemukan!* ☹️')
        }

        const sec = Number(res.duration) || 0
        const durasi = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

        await conn.sendMessage(m.chat, {
            image: { url: res.thumbnail },
            caption: `「 *YOUTUBE PLAY* 」
└╼ Title : ${res.title}
└╼ Duration : ${durasi}
└╼ URL Video : ${res.source}`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluranId,
                    newsletterName: config.saluranName,
                    serverMessageId: 127
                }
            }
        }, { quoted: m })

        const file = await axios.get(res.audio.url, {
            responseType: 'arraybuffer',
            timeout: 180000,
            maxContentLength: Infinity,
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36' }
        })

        let audio = Buffer.from(file.data)
        if (!audio.length) throw new Error('File audio kosong')

        try {
            audio = await toAudio(audio, res.audio.type || 'mp3')
        } catch {}

        await conn.sendMessage(m.chat, {
            audio,
            mimetype: 'audio/mpeg',
            fileName: `${res.title}.mp3`,
            ptt: false
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe(`Terjadi kesalahan saat memproses lagu: ${e.message}`)
    }
}

handler.help = ['play <judul>']
handler.tags = ['search']
handler.command = /^(play|ytplay)$/i

export default handler
