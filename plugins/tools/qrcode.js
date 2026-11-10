import QRCode from 'qrcode'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command}* https://github.com`)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        // BIKIN QR LANGSUNG DI SERVER LU, GAK NGIRIM KE SIAPAPUN!
        let imgBuffer = await QRCode.toBuffer(text, {
            width: 512,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' }
        })

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
