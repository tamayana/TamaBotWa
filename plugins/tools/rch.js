import axios from 'axios'

const API_KEY = '36LT6K5N'
const API_URL = 'https://reaction-whatsapp.edgeone.dev/react'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`*Contoh:*\n*${usedPrefix + command}* https://whatsapp.com/channel/xxxx/123 😘`)

    const args = text.trim().split(/\s+/)
    const link = args[0]
    const emoji = args[1] || '😘'

    if (!link || !link.includes('whatsapp.com/channel/')) {
        return RaplyGwe(`Link tidak valid. Pastikan menggunakan link WhatsApp Channel.`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    await RaplyGwe(`Sedang mengirim reaction...`)

    try {
        const { data } = await axios.post(API_URL, {
            link: link,
            emoji: emoji
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            timeout: 30000
        })

        if (!data || data.status === false || data.error) {
            throw new Error(data.message || data.error || 'Gagal mengirim reaction.')
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        
        let msg = `✅ *REACTION BERHASIL DIKIRIM*\n\n`
        msg += `*Link:* ${link}\n`
        msg += `*Emoji:* ${emoji}\n`

        await RaplyGwe(msg)

    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        const errMsg = e.response?.data?.message || e.response?.data?.error || e.message
        await RaplyGwe(`❌ *Gagal:* ${errMsg}`)
    }
}

handler.command = /^(rch|reactch)$/i
handler.tags = ['tools']
handler.help = ['rch <link_channel> <emoji>']

export default handler
