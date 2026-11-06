import axios from 'axios'
import config from '../../config.js'

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

async function mediafire(url) {
    const match = /https?:\/\/(?:www\.)?mediafire\.com\/(?:file|file_premium)\/([a-zA-Z0-9]+)/i.exec(url)
    if (!match) throw 'URL tidak valid! Pastikan link MediaFire benar.'

    const id = match[1]
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    })
    const html = response.data
    const dlMatch = html.match(/<a\s+[^>]*?id="downloadButton"[^>]*?href="([^"]+)"/i) || html.match(/<a\s+[^>]*?href="([^"]+)"[^>]*?id="downloadButton"/i)
    const download = dlMatch ? dlMatch[1] : null
    if (!download) throw 'Gagal mengambil link unduhan dari halaman Mediafire.'

    const infoRes = await axios.get(`https://www.mediafire.com/api/1.5/file/get_info.php?response_format=json&quick_key=${id}`)
    const json = infoRes.data

    if (json.response.result !== 'Success') throw 'Gagal mengambil info file.'
    const info = json.response.file_info
    const size = parseInt(info.size)

    return {
        filename: info.filename,
        ext: info.filename.split('.').pop(),
        size: size,
        sizeReadable: formatBytes(size),
        download: download,
        filetype: info.filetype,
        mimetype: info.mimetype || 'application/octet-stream',
        privacy: info.privacy,
        owner_name: info.owner_name
    }
}

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text || !text.includes('mediafire.com')) {
        return RaplyGwe(`Kirimkan link MediaFire!\nContoh: *${usedPrefix + command}* https://www.mediafire.com/file/xxx/file.zip`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    await RaplyGwe(`Sedang memproses MediaFire...`)

    try {
        const res = await mediafire(text.trim())
        
        if (res.size > 100 * 1024 * 1024) {
            throw `Ukuran file terlalu besar (${res.sizeReadable}). WhatsApp hanya mendukung file di bawah 100MB.`
        }

        let msg = `✅ *MEDIAFIRE DOWNLOADER*\n\n`
        msg += `📁 *Nama:* ${res.filename}\n`
        msg += `📦 *Ukuran:* ${res.sizeReadable}\n`
        msg += `🔒 *Privasi:* ${res.privacy}\n`
        msg += `👤 *Pemilik:* ${res.owner_name}\n\n`
        msg += `_⏳ Mengunduh file ke server, harap tunggu..._`
        
        await RaplyGwe(msg)

        const fileRes = await axios.get(res.download, { responseType: 'arraybuffer', timeout: 120000 })
        const buffer = Buffer.from(fileRes.data)

        await conn.sendMessage(m.chat, {
            document: buffer,
            mimetype: res.mimetype,
            fileName: res.filename,
            caption: `✅ *BERHASIL DIUNDUH*\n📁 ${res.filename} (${res.sizeReadable})`,
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
        await RaplyGwe(`❌ *Gagal:* ${e.message || e}`)
    }
}

handler.command = /^(mediafire|mf)$/i
handler.tags = ['downloader']
handler.help = ['mediafire <url>']

export default handler
