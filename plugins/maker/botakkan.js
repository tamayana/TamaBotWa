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

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image/.test(mime)) return m.reply(`Balas gambar dengan perintah *${usedPrefix + command}*`)

    m.reply('Sedang memproses gambar, mohon tunggu...')

    try {
        let buffer = await q.download()
        if (!buffer) return m.reply('Gagal mengunduh gambar.')

        let url = await upPone(buffer, `img_${Date.now()}.jpg`)
        if (!url) return m.reply('Gagal mengunggah gambar ke server.')

        let api = `https://api.ikyyxd.my.id/edit/tobotak?url=${encodeURIComponent(url)}`
        let res = await axios.get(api, { responseType: 'arraybuffer' }).catch(() => null)
        
        if (!res) return m.reply('Gagal menghubungi API. Pastikan server API sedang online.')

        let ct = res.headers['content-type'] || ''
        
        if (ct.includes('image')) {
            await conn.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '✅ Berhasil diproses!' }, { quoted: m })
        } else {
            let json = JSON.parse(Buffer.from(res.data).toString())
            let out = json.result || json.url || json.data?.url || json.image || json.data?.image || null
            
            if (!out) return m.reply('Gagal mendapatkan link hasil dari API.')
            
            await conn.sendMessage(m.chat, { image: { url: out }, caption: '✅ Berhasil diproses!' }, { quoted: m })
        }

    } catch (e) {
        m.reply('Terjadi kesalahan saat memproses gambar.')
    }
}

handler.help = ['tobotak']
handler.tags = ['tools']
handler.command = /^(tobotak|botak)$/i

export default handler