import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command}* king biologi`)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const { data } = await axios.get('https://api.kyzzz.xyz/api/ai/prompt-generator', {
            params: {
                text: text,
                apikey: 'kyzz211554828'
            },
            timeout: 60000
        })

        if (!data.status || !data.result) throw new Error('Respon kosong dari API.')

        const { english, indonesian } = data.result

        let reply = `🎨 *IMAGE PROMPT GENERATOR*\n\n`
        reply += `🇬🇧 *English:*\n_${english}_\n\n`
        reply += `🇮🇩 *Indonesia:*\n_${indonesian}_`

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

handler.command = /^(promptgen|imageprompt)$/i
handler.tags = ['ai']
handler.help = ['promptgen <teks>']

export default handler
