import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let url = text?.trim()
    if (!url || !url.includes('capcut.com')) {
        return RaplyGwe(`Contoh: *${usedPrefix + command}* https://www.capcut.com/template-detail/...`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        let { data } = await axios.post('https://3bic.com/api/download', { url }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://3bic.com',
                'Referer': 'https://3bic.com/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            },
            timeout: 15000
        })

        if (data?.code !== 200) throw new Error(data?.message || 'Gagal memproses URL.')

        let dl = data.originalVideoUrl || ''
        if (dl.startsWith('/')) dl = `https://3bic.com${dl}`
        if (!dl) throw new Error('Link download tidak ditemukan.')

        let cap = `✅ *CAPCUT DOWNLOADER*\n\n`
            + `📌 *Judul:* ${data.title || 'No Title'}\n`
            + `👤 *Author:* ${data.authorName || '-'}\n\n`
            + `> _Berhasil diunduh dalam kualitas HD._`

        let buf = await axios.get(dl, { responseType: 'arraybuffer' }).then(r => Buffer.from(r.data))

        await conn.sendMessage(m.chat, {
            video: buf,
            mimetype: 'video/mp4',
            caption: cap,
            contextInfo: {
                forwardingScore: 9,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluranId,
                    newsletterName: config.saluranName,
                    serverMessageId: 127
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.message}`)
    }
}

handler.command = /^(capcut|capcutdl)$/i
handler.tags = ['downloader']
handler.help = ['capcut <url>']

export default handler
