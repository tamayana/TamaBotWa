import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let code = text || ''

    if (!code && m.quoted && /javascript|text|octet-stream/.test(mime)) {
        let buffer = await q.download().catch(() => null)
        if (buffer) code = buffer.toString('utf-8')
    }

    if (!code && m.quoted?.text) code = m.quoted.text

    if (!code.trim()) {
        return RaplyGwe(`Masukkan kode atau balas file .js!\n\nContoh: *${usedPrefix + command}* console.log("Hello")`)
    }

    await m.react('🕒')

    try {
        let form = new FormData()
        form.append('code', code)
        form.append('level', 'low')

        let { data } = await axios.post('https://api.kyzzz.xyz/api/tools/js-obfuscator', form, {
            params: { apikey: 'kyzz211554828' },
            headers: form.getHeaders(),
            timeout: 60000,
            maxBodyLength: Infinity
        })

        if (!data?.status || !data?.result) throw new Error(data?.message || data?.error || 'Respon kosong dari API.')

        await conn.sendMessage(m.chat, {
            document: Buffer.from(data.result, 'utf-8'),
            mimetype: 'application/javascript',
            fileName: 'enc.js',
            caption: `✅ *Enc berhasil*\n\n◦ Ukuran asli: ${data.originalLength}\n◦ Ukuran hasil: ${data.obfuscatedLength}`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error('[enc]', e)
        await m.react('❌')
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.response?.data?.error || e.message}`.slice(0, 600))
    }
}

handler.help = ['enc <kode>']
handler.tags = ['tools']
handler.command = /^(enc|encrypt|obfuscate)$/i

export default handler
