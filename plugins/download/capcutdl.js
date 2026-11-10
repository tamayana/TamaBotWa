import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let url = text?.trim()
    if (!url || !url.includes('capcut.com')) {
        return RaplyGwe(`Contoh: *${usedPrefix + command}* https://www.capcut.com/template-detail/...`)
    }

    await m.react('⏳')

    try {
        let { data } = await axios.post('https://3bic.com/api/download', { url }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://3bic.com',
                'Referer': 'https://3bic.com/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            },
            timeout: 20000
        })

        if (data?.code !== 200) throw new Error(data?.message || 'Gagal memproses URL.')

        let dl = data.originalVideoUrl || ''
        if (dl.startsWith('/')) dl = `https://3bic.com${dl}`
        if (!dl) throw new Error('Link download tidak ditemukan.')

        // Cek ukuran dulu biar gak jebol! Max 90MB
        try {
            let head = await axios.head(dl, { timeout: 15000 })
            let size = Number(head.headers['content-length'] || 0)
            if (size > 90 * 1024 * 1024) {
                await m.react('❌')
                return RaplyGwe(`❌ Video kegedean bung! *${(size / 1024 / 1024).toFixed(1)} MB*\nMax WhatsApp 90MB!\n\nLink nya aja ya:\n${dl}`)
            }
        } catch { /* lanjut aja kalo head gagal */ }

        let cap = `✅ *CAPCUT DOWNLOADER*\n\n`
            + `📌 *Judul:* ${data.title || 'No Title'}\n`
            + `👤 *Author:* ${data.authorName || '-'}\n\n`
            + `> _Berhasil diunduh dalam kualitas HD._`

        let buf = await axios.get(dl, { responseType: 'arraybuffer', timeout: 60000, maxContentLength: 90 * 1024 * 1024 }).then(r => Buffer.from(r.data))

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

        await m.react('✅')

    } catch (e) {
        await m.react('❌')
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.message}`)
    }
}

handler.command = /^(capcut|capcutdl)$/i
handler.tags = ['downloader']
handler.help = ['capcut <url>']

export default handler
