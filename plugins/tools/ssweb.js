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

    // GRATIS TANPA APIKEY - 2 Cadangan
    // 1. thum.io (utama) - 2. wordpress mshots (cadangan)
    const cleanUrl = url.replace(/^https?:\/\//i, '')
    const shot1 = `https://image.thum.io/get/width/1200/crop/800/fullpage/${url}`
    const shot2 = `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`

    // Coba kirim pake thum.io dulu, kalo gagal pake mshots
    for (const image of [shot1, shot2]) {
        try {
            await conn.sendMessage(m.chat, {
                image: { url: image },
                caption: `✅ *Screenshot Website*\n🔗 ${url}`,
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
            return
        } catch (e) {
            console.error('[ssweb] gagal pake', image, e.message)
            continue
        }
    }

    await m.react('❌')
    await RaplyGwe(`Gagal mengambil screenshot.\n\nCoba lagi nanti, layanan screenshot lagi down.`)
}

handler.help = ['ssweb <link>']
handler.tags = ['tools']
handler.command = /^(ssweb|ss|screenshot)$/i

export default handler
