import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    let url = text || args[0]

    if (!url) return RaplyGwe(`Kirim link!\nContoh: *${usedPrefix + command}* https://vt.tiktok.com/...`)
    if (!url.startsWith('http')) return RaplyGwe('URL tidak valid. Pastikan diawali dengan http/https.')

    await RaplyGwe('Sedang memproses link, mohon tunggu...')

    try {
        let res = await axios.get(`https://api.ikyyxd.my.id/download/all-in-one?url=${encodeURIComponent(url)}`)
        let data = res.data?.result || res.data?.data

        if (!data) return RaplyGwe('Gagal mengambil data dari API. Pastikan link valid.')

        let title = data.title || data.caption || 'No Title'
        let dl = data.url || data.download || data.video || data.audio || data.medias?.[0]?.url

        if (!dl) return RaplyGwe('Gagal menemukan link download dari API.')

        let cap = `*✅ Berhasil Diunduh*\n*└▢ Judul:* ${title}`
        
        let type = (data.type || data.mediatype || data.ext || data.medias?.[0]?.type || '').toLowerCase()
        let isVideo = /\.(mp4|mkv|webm)$/i.test(dl) || type === 'video' || type === 'mp4'
        let isImage = /\.(jpg|jpeg|png|webp)$/i.test(dl) || type === 'image' || type === 'jpg' || type === 'png'
        let isAudio = /\.(mp3|ogg|m4a)$/i.test(dl) || type === 'audio' || type === 'mp3'

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
        await RaplyGwe('Terjadi kesalahan saat memproses link.')
    }
}

handler.help = ['aio <link>']
handler.tags = ['downloader']
handler.command = /^(aio)$/i

export default handler