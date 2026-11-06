import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, RaplyGwe }) => {
    await m.react('🕒')

    try {
        let { data, status } = await axios.get('https://api.kyzzz.xyz/api/random/tobrut', {
            params: { apikey: 'kyzz211554828' },
            responseType: 'arraybuffer',
            timeout: 120000,
            validateStatus: () => true
        })

        let video = Buffer.from(data)

        if (status !== 200 || video.toString('ascii', 4, 8) !== 'ftyp') {
            throw new Error(`API status ${status}: ${video.toString('utf-8', 0, 150).trim()}`)
        }

        await conn.sendMessage(m.chat, {
            video,
            mimetype: 'video/mp4',
            caption: '✅ *Random Tobrut*',
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

        await m.react('✅')
    } catch (e) {
        console.error('[tobrut]', e)
        await m.react('❌')
        await RaplyGwe(`Gagal mengambil video.\n\n${e.message}`.slice(0, 600))
    }
}

handler.help = ['tobrut']
handler.tags = ['fun']
handler.command = /^(tobrut)$/i

export default handler
