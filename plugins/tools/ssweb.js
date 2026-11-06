import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let url = (text || m.quoted?.text || '').trim().split(/\s+/)[0]
    if (!url) return RaplyGwe(`Masukkan link website!\nContoh: *${usedPrefix + command}* https://google.com`)

    if (!/^https?:\/\//i.test(url)) url = `https://${url}`

    try {
        new URL(url)
    } catch {
        return RaplyGwe('Link tidak valid.')
    }

    await m.react('🕒')

    try {
        let { data } = await axios.get('https://api.kyzzz.xyz/api/tools/ssweb', {
            params: { url, device: 'desktop', apikey: 'kyzz211554828' },
            timeout: 60000
        })

        let image = data?.result?.screenshot_url
        if (!data?.status || !image) throw new Error(data?.message || data?.error || 'Screenshot tidak ditemukan.')

        await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `✅ *Screenshot Website*`,
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
        console.error('[ssweb]', e)
        await m.react('❌')
        await RaplyGwe(`Gagal mengambil screenshot.\n\n${e.message}`.slice(0, 600))
    }
}

handler.help = ['ssweb <link>']
handler.tags = ['tools']
handler.command = /^(ssweb|ss|screenshot)$/i

export default handler
