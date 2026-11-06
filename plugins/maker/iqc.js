import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const targetText = (text || m.quoted?.text || m.quoted?.caption || '').trim()

    if (!targetText) {
        return RaplyGwe(`Masukkan teks atau balas pesan!\nContoh: *${usedPrefix + command}* Halo, apa kabar?`, 'IQC')
    }

    await m.react('⌛')

    try {
        const apiUrl = `https://my.izuka-api.xyz/api/canvas/iqc?text=${encodeURIComponent(targetText)}`

        const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 })
        const type = String(res.headers?.['content-type'] || '')
        const image = Buffer.from(res.data)

        if (!/image/i.test(type) || image.length < 1024) {
            throw new Error('API tidak mengembalikan gambar')
        }

        await conn.sendMessage(m.chat, { image }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        console.error('[iqc]', e)
        await m.react('❌')
        await RaplyGwe(`Gagal membuat gambar IQC: ${e.message}`, 'IQC')
    }
}

handler.command = ['iqc']
handler.category = ['maker']

export default handler
