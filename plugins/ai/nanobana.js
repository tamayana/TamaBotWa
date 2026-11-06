import axios from 'axios'
import FormData from 'form-data'

async function upPone(buffer, filename) {
    const form = new FormData()
    form.append('files[]', buffer, { filename })

    try {
        const res = await axios.post('https://pone.rs/upload.php', form, {
            headers: {
                ...form.getHeaders(),
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                accept: '*/*',
                origin: 'https://pone.rs',
                referer: 'https://pone.rs/'
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        })
        return res.data?.files?.[0]?.url?.replaceAll('\\/', '/') || null
    } catch {
        return null
    }
}

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image/.test(mime)) return RaplyGwe(`Balas gambar dengan perintah *${usedPrefix + command}* <prompt>`)
    if (!text) return RaplyGwe(`Masukkan prompt!\nContoh: *${usedPrefix + command}* ubah jadi gaya anime`)

    RaplyGwe('Sedang memproses gambar, mohon tunggu...')

    try {
        let buffer = await q.download()
        if (!buffer) return RaplyGwe('Gagal mengunduh gambar.')

        let url = await upPone(buffer, `img_${Date.now()}.jpg`)
        if (!url) return RaplyGwe('Gagal mengunggah gambar ke server.')

        let api = `http://api.ikyyxd.my.id/edit/nanobanana?image=${encodeURIComponent(url)}&prompt=${encodeURIComponent(text)}`
        let res = await axios.get(api, { responseType: 'arraybuffer' }).catch(() => null)
        
        if (!res) return RaplyGwe('Gagal menghubungi API. Pastikan server API sedang online.')

        let ct = res.headers['content-type'] || ''
        
        if (ct.includes('image')) {
            await conn.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '✅ Berhasil diproses!' }, { quoted: m })
        } else {
            let json = JSON.parse(Buffer.from(res.data).toString())
            let resultUrl = json.result || json.url || json.data?.url || json.image || null
            
            if (!resultUrl) return RaplyGwe('Gagal mendapatkan link hasil dari API.')
            
            await conn.sendMessage(m.chat, { image: { url: resultUrl }, caption: '✅ Berhasil diproses!' }, { quoted: m })
        }

    } catch (e) {
        RaplyGwe('Terjadi kesalahan saat memproses gambar.')
    }
}

handler.help = ['nanobanana <prompt>']
handler.tags = ['ai']
handler.command = /^(nanobanana)$/i

export default handler