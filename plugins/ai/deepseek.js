import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command}* Jelaskan teori relativitas`)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const { data } = await axios.get('https://api.kyzzz.xyz/api/ai/deepseek', {
            params: {
                prompt: text,
                apikey: 'kyzz211554828'
            },
            timeout: 60000
        })

        let reply = data?.result?.answer

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

handler.command = /^(deepseek|ds)$/i
handler.tags = ['ai']
handler.help = ['deepseek <pertanyaan>']

export default handler
