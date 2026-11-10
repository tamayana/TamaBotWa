import axios from 'axios'
import config from '../../config.js'
import { toAudio } from '../../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Kirim judul lagu!\nContoh: *${usedPrefix + command}* Cikadap`)
    if (text.length > 100) return RaplyGwe('Judul kepanjangan anjing, max 100 karakter!')

    await m.react('⌛').catch(() => {})

    try {
        const { data } = await axios.get('https://api.ikyyxd.my.id/search/ytplayv2', {
            params: { q: text },
            timeout: 60000,
            maxContentLength: 5 * 1024 * 1024 // Max 5MB buat data JSON, biar gak jebol
        })

        const res = data?.result
        if (!data?.status || !res?.audio?.url) {
            await m.react('❌').catch(() => {})
            return RaplyGwe('*Lagu tidak ditemukan!* ☹️')
        }

        // Validasi URL, cuma boleh http/https
        if (!/^https?:\/\//.test(res.audio.url) || !/^https?:\/\//.test(res.thumbnail)) {
            throw new Error('URL tidak valid!')
        }

        const sec = Number(res.duration) || 0
        const durasi = sec > 0 ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` : res.duration || '0:00'

        await conn.sendMessage(m.chat, {
            image: { url: res.thumbnail },
            caption: `「 *YOUTUBE PLAY* 」
└╼ Title : ${res.title}
└╼ Duration : ${durasi}
└╼ URL Video : ${res.source}
└╼ Powered By : TAMA-ID`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluranId,
                    newsletterName: config.saluranName,
                    serverMessageId: 127
                }
            }
        }, { quoted: m })

        // Download audio, max 20MB
        const file = await axios.get(res.audio.url, {
            responseType: 'arraybuffer',
            timeout: 180000,
            maxContentLength: 20 * 1024 * 1024,
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36' }
        })

        let audio = Buffer.from(file.data)
        if (!audio.length) throw new Error('File audio kosong')

        try {
            audio = await toAudio(audio, res.audio.type || 'mp3')
        } catch {}

        // Bersihin nama file, biar gak bisa dihack lewat judul lagu
        const cleanName = String(res.title || 'audio').replace(/[\\/:*?"<>|]/g, '').slice(0, 80)

        await conn.sendMessage(m.chat, {
            audio,
            mimetype: 'audio/mpeg',
            fileName: `${cleanName}.mp3`,
            ptt: false
        }, { quoted: m })

        await m.react('✅').catch(() => {})
    } catch (e) {
        await m.react('❌').catch(() => {})
        console.error('[play TAMA-ID]', e.message)
        await RaplyGwe(`Terjadi kesalahan, coba lagi anjing!`)
    }
}

handler.help = ['play <judul>']
handler.tags = ['search']
handler.command = /^(play|ytplay)$/i

export default handler
