import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const targetText = (text || m.quoted?.text || m.quoted?.caption || '').trim()

    if (!targetText) {
        return RaplyGwe(`Masukkan teks atau balas pesan!\nContoh: *${usedPrefix + command}* Halo, apa kabar?`, 'IQC')
    }
    if (targetText.length > 200) return RaplyGwe('Teks kepanjangan anjing! Max 200 karakter aja!', 'IQC')

    await m.react('⌛').catch(()=>{})

    try {
        // API PUBLIK, TANPA APIKEY
        const apis = [
            `https://my.izuka-api.xyz/api/canvas/iqc?text=${encodeURIComponent(targetText)}`,
            `https://api.ikyyxd.my.id/maker/iqc?text=${encodeURIComponent(targetText)}`
        ]

        let image = null

        for (let apiUrl of apis) {
            try {
                const res = await axios.get(apiUrl, { 
                    responseType: 'arraybuffer', 
                    timeout: 30000,
                    maxContentLength: 5 * 1024 * 1024,
                    validateStatus: () => true
                })
                const type = String(res.headers?.['content-type'] || '')
                const buf = Buffer.from(res.data)
                if (res.status === 200 && /image/i.test(type) && buf.length > 1024) {
                    image = buf
                    break
                }
            } catch {}
        }

        if (!image) throw new Error('Semua API IQC lagi offline')

        await conn.sendMessage(m.chat, { image, caption: '✅ Berhasil diproses!\n└╼ Powered By : TAMA-ID' }, { quoted: m })
        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[iqc TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe(`Gagal membuat gambar IQC, coba lagi anjing!`, 'IQC')
    }
}

handler.help = ['iqc <teks>']
handler.tags = ['maker']
handler.command = /^(iqc)$/i

export default handler
