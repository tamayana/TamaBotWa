import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command}* https://github.com`)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const url = `https://api.ikyyxd.my.id/tools/qrcode?text=${encodeURIComponent(text)}`
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        
        let imgBuffer = Buffer.from(res.data)
       
        if (!(res.headers['content-type'] || '').includes('image')) {
            const match = imgBuffer.toString('utf-8').match(/https?:\/\/[^\s"']+/g)
            if (!match) throw new Error('API tidak mengembalikan format gambar yang valid.')
            const imgRes = await axios.get(match[0], { responseType: 'arraybuffer' })
            imgBuffer = Buffer.from(imgRes.data)
        }

        await conn.sendMessage(m.chat, {
            image: imgBuffer,
            caption: '✅ ```QR CODE BERHASIL DIBUAT```',
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
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.message}`)
    }
}

handler.command = /^(qrcode|qr)$/i
handler.tags = ['tools']
handler.help = ['qrcode <teks>']

export default handler
