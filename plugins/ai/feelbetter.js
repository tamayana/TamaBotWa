import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command}* Lagi sedih nih kak`)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const { data } = await axios.get('https://api.kyzzz.xyz/api/ai/feelbetter', {
            params: {
                message: text,
                session: m.sender.split('@')[0],
                prompt: 'Kamu adalah asisten profesional yang tegas dan to the point',
                apikey: 'kyzz211554828'
            },
            timeout: 60000
        })

        let reply = data?.reply

        if (!reply) throw new Error('Respon kosong dari API.')

        await conn.sendMessage(m.chat, {
            text: reply,
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
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.message}`)
    }
}

handler.command = /^(feelbetter|curhat)$/i
handler.tags = ['ai']
handler.help = ['feelbetter <pesan>']

export default handler
