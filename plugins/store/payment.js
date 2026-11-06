import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import config from '../../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const thumbPath = path.join(__dirname, '../../media/thumb.jpg')

let handler = async (m, { conn }) => {
    const msgx = `‼️\`𝖬𝖾𝗍𝗈𝖽𝖾 𝖯𝖾𝗆𝖻𝖺𝗒𝖺𝗋𝖺𝗇\`
_Detail Metode Pembayaran Kami, Sertakan Bukti Transaksi!_

*E-Wallet:*
> Dana: ${config.dana || "Tidak Tersedia"}
> OVO: ${config.ovo || "Tidak Tersedia"}
> GoPay: ${config.gopay || "Tidak Tersedia"}

> 📌 _Silakan transfer sesuai nominal, lalu kirim bukti ke Admin._`

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(thumbPath),
        caption: msgx,
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
}

handler.command = /^(payment|pay)$/i
handler.tags = ['store']
handler.help = ['payment']

export default handler
