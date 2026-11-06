import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, RaplyGwe }) => {
    await m.react('⌛')

    try {
        const { data } = await axios.get('https://api.ikyyxd.my.id/Info/cekgempa', { timeout: 30000 })

        const g = data?.data
        if (!data?.status || !g) {
            await m.react('❌')
            return RaplyGwe('*Data gempa tidak tersedia!* ☹️')
        }

        const caption = `「 *INFO GEMPA TERKINI* 」
└╼ Tanggal : ${g.tanggal}
└╼ Waktu : ${g.jam}
└╼ Magnitudo : ${g.magnitude} SR
└╼ Kedalaman : ${g.kedalaman}
└╼ Lokasi : ${g.lintang} - ${g.bujur}
└╼ Wilayah : ${g.wilayah}
└╼ Potensi : ${g.potensi}
└╼ Dirasakan : ${g.dirasakan}`

        const contextInfo = {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluranId,
                newsletterName: config.saluranName,
                serverMessageId: 127
            }
        }

        if (g.shakemap) {
            const url = /^https?:\/\//.test(g.shakemap) ? g.shakemap : `https://static.bmkg.go.id/${g.shakemap}`
            await conn.sendMessage(m.chat, { image: { url }, caption, contextInfo }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { text: caption, contextInfo }, { quoted: m })
        }

        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe(`Terjadi kesalahan saat mengambil data gempa: ${e.message}`)
    }
}

handler.help = ['cekgempa']
handler.tags = ['tools']
handler.command = /^(cekgempa|gempa|infogempa)$/i

export default handler
