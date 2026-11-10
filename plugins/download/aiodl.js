import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let url = text?.trim()
    if (!url) return RaplyGwe(`Kirim link!\nContoh: *${usedPrefix + command}* https://vt.tiktok.com/...`)
    if (!url.startsWith('http')) return RaplyGwe('URL tidak valid. Pastikan diawali dengan http/https.')

    await RaplyGwe('⏳ Sedang memproses link, mohon tunggu...')

    try {
        let res = await axios.get(`https://api.ikyyxd.my.id/download/all-in-one?url=${encodeURIComponent(url)}`, { timeout: 60000 })
        let data = res.data?.result || res.data?.data

        if (!data) return RaplyGwe('❌ Gagal mengambil data dari API. Pastikan link valid / API lagi down.')

        let title = data.title || data.caption || 'No Title'
        // Ambil media terbaik: utamakan video kualitas tinggi, bukan yang pertama aja
        let medias = data.medias || data.media || []
        let dl = data.url || data.download || data.video || data.audio
        if (!dl && medias.length) {
            // Cari yang video dulu, kalo gak ada baru ambil yang pertama
            let best = medias.find(v => /video|mp4/i.test(v.type || v.format || '')) || medias[0]
            dl = best?.url
        }
        if (!dl) return RaplyGwe('❌ Gagal menemukan link download dari API.')

        let cap = `*✅ Berhasil Diunduh*\n*└▢ Judul:* ${title}`

        let type = (data.type || data.mediatype || data.ext || medias[0]?.type || '').toLowerCase()
        let isVideo = /\.(mp4|mkv|webm)$/i.test(dl) || type === 'video' || type === 'mp4'
        let isImage = /\.(jpg|jpeg|png|webp)$/i.test(dl) || type === 'image' || type === 'jpg' || type === 'png'
        let isAudio = /\.(mp3|ogg|m4a)$/i.test(dl) || type === 'audio' || type === 'mp3'

        // Cek ukuran dulu biar gak jebol! Max 90MB buat WhatsApp
        try {
            let head = await axios.head(dl, { timeout: 15000 })
            let size = Number(head.headers['content-length'] || 0)
            if (size > 90 * 1024 * 1024) {
                return RaplyGwe(`❌ File kegedean bung! *${(size / 1024 / 1024).toFixed(1)} MB*\nMax WhatsApp cuma 90MB!\n\nIni link nya aja ya:\n${dl}`)
            }
        } catch { /* kalo head gagal, lanjut aja */ }

        if (isVideo) {
            await conn.sendMessage(m.chat, { video: { url: dl }, caption: cap }, { quoted: m })
        } else if (isImage) {
            await conn.sendMessage(m.chat, { image: { url: dl }, caption: cap }, { quoted: m })
        } else if (isAudio) {
            await conn.sendMessage(m.chat, { audio: { url: dl }, mimetype: 'audio/mp4' }, { quoted: m })
        } else {
            try {
                await conn.sendMessage(m.chat, { video: { url: dl }, caption: cap }, { quoted: m })
            } catch {
                await conn.sendMessage(m.chat, { text: `${cap}\n\n*Link:* ${dl}` }, { quoted: m })
            }
        }

    } catch (e) {
        console.log('AIO ERROR:', e.message)
        await RaplyGwe(`❌ Terjadi kesalahan saat memproses link.\n\n*Detail:* ${e.message}\nCoba lagi nanti / ganti link lain!`)
    }
}

handler.help = ['aio <link>']
handler.tags = ['downloader']
handler.command = /^(aio)$/i

export default handler
