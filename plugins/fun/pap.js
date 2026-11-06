import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    await m.react('📸')

    try {
        const { data } = await axios.get('https://api.nexadev.my.id/api/random/pap', {
            responseType: 'arraybuffer'
        })
        
        const buffer = Buffer.from(data)

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: '📸 *Random pap*',
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

    } catch (e) {
        await m.react('❌')
        await RaplyGwe(`❌ *Gagal:* ${e.message || e}`)
    }
}

handler.command = /^(pap)$/i
handler.tags = ['fun']
handler.help = ['pap']

export default handler