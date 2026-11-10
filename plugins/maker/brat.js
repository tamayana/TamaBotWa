import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    text = text || m.quoted?.text || ''
    if (!text.trim()) return RaplyGwe(`Masukkan teks!\nContoh: *${usedPrefix + command}* Halo dunia`)
    if (text.trim().length > 100) return RaplyGwe('Teks kepanjangan anjing! Max 100 karakter aja!')

    await m.react('🕒').catch(()=>{})

    try {
        // API PUBLIK GRATIS, TANPA APIKEY! 0 CURIAN!
        // Coba API 1 dulu, kalo gagal pindah ke API 2
        let data = null
        let headers = {}

        const apis = [
            `https://api.ikyyxd.my.id/maker/brat?text=${encodeURIComponent(text.trim())}`,
            `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text.trim())}`
        ]

        for (let apiUrl of apis) {
            try {
                let res = await axios.get(apiUrl, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    maxContentLength: 5 * 1024 * 1024,
                    validateStatus: () => true
                })
                if (res.status === 200 && /^image\//i.test(res.headers['content-type'] || '')) {
                    data = res.data
                    headers = res.headers
                    break
                }
            } catch {}
        }

        if (!data) throw new Error('Semua API brat lagi offline, coba lagi nanti!')

        await conn.sendSticker(m.chat, Buffer.from(data), m, {
            packname: global.stickpack || global.namebot || config.botName || 'TAMA-ID',
            author: global.stickauth || global.author || config.ownerName || 'TAMA-ID'
        })

        await m.react('✅').catch(()=>{})
    } catch (e) {
        console.error('[brat TAMA-ID]', e.message)
        await m.react('❌').catch(()=>{})
        await RaplyGwe(`Gagal membuat stiker, coba lagi anjing!`)
    }
}

handler.help = ['brat <teks>']
handler.tags = ['maker']
handler.command = /^(brat)$/i

export default handler
