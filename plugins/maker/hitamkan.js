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
            timeout: 30000,
            maxBodyLength: 10 * 1024 * 1024,
            maxContentLength: 10 * 1024 * 1024
        })
        const url = res.data?.files?.[0]?.url?.replaceAll('\\/', '/') || null
        if (!url || !/^https?:\/\//.test(url)) return null
        return url
    } catch (e) {
        console.error('[jadihitam upload]', e.message)
        return null
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`Balas gambar dengan perintah *${usedPrefix + command}*`)

    await m.reply('Sedang memproses gambar, mohon tunggu...').catch(()=>{})

    try {
        let buffer = await q.download()
        if (!buffer || !buffer.length) return m.reply('Gagal mengunduh gambar.')

        if (buffer.length > 5 * 1024 * 1024) return m.reply('Gambar kegedean anjing! Max 5MB aja!')

        let url = await upPone(buffer, `img_${Date.now()}.jpg`)
        if (!url) return m.reply('Gagal mengunggah gambar ke server, coba lagi anjing! Server upload lagi lemot.')

        let api = `https://api.ikyyxd.my.id/edit/jadihitam?url=${encodeURIComponent(url)}`
        let res = await axios.get(api, { 
            responseType: 'arraybuffer',
            timeout: 60000,
            maxContentLength: 10 * 1024 * 1024
        }).catch(() => null)
        
        if (!res || !res.data) return m.reply('Gagal menghubungi API. Server API lagi offline, coba lagi nanti!')

        let ct = res.headers['content-type'] || ''
        
        if (ct.includes('image')) {
            if (Buffer.from(res.data).length < 1000) return m.reply('Hasil dari API rusak / kosong, coba lagi!')
            await conn.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '✅ Berhasil diproses!\n└╼ Powered By : TAMA-ID' }, { quoted: m })
        } else {
            let text = Buffer.from(res.data).toString()
            let json
            try { json = JSON.parse(text) } catch { return m.reply('API ngasih respon aneh, coba lagi!') }
            let out = json.result || json.url || json.data?.url || json.image || json.data?.image || null
            
            if (!out || !/^https?:\/\//.test(out)) return m.reply('Gagal mendapatkan link hasil dari API.')
            
            await conn.sendMessage(m.chat, { image: { url: out }, caption: '✅ Berhasil diproses!\n└╼ Powered By : TAMA-ID' }, { quoted: m })
        }

    } catch (e) {
        console.error('[jadihitam TAMA-ID]', e.message)
        m.reply('Terjadi kesalahan saat memproses gambar, coba lagi anjing!')
    }
}

handler.help = ['jadihitam']
handler.tags = ['maker']
handler.command = /^(jadihitam|hitam)$/i

export default handler
