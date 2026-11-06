import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    global.ampremv2 = global.ampremv2 || new Map()

    const api = axios.create({
        baseURL: 'https://am.kyzzz.xyz',
        timeout: 20000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
        }
    })

    const input = (text || '').trim()
    const session = global.ampremv2.get(m.sender)
    const ttl = 10 * 60 * 1000
    const react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

    if (session && Date.now() - session.time > ttl) global.ampremv2.delete(m.sender)

    switch (command) {
        case 'ampremv2': {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input)) {
                return RaplyGwe(
                    `*AM PREMIUM V2*\n\n` +
                    `Format penggunaan:\n` +
                    `${usedPrefix}${command} <email>\n\n` +
                    `Contoh:\n` +
                    `${usedPrefix}${command} user@gmail.com`
                )
            }

            await react('⏳')
            try {
                const { data } = await api.post('/api/send-link', { email: input })
                if (!data?.success) throw new Error(data?.message || 'Gagal mengirim magic link.')

                global.ampremv2.set(m.sender, { email: input, time: Date.now() })

                await RaplyGwe(
                    `*MAGIC LINK TERKIRIM*\n\n` +
                    `Email  : ${input}\n` +
                    `Status : ${data.message || 'Berhasil dikirim'}\n\n` +
                    `Periksa inbox atau folder spam, lalu kirim link yang diterima dengan perintah:\n` +
                    `${usedPrefix}verifv2 <link>\n\n` +
                    `_Sesi berlaku selama 10 menit._`
                )
                await react('📩')
            } catch (e) {
                await react('❌')
                await RaplyGwe(`*GAGAL MENGIRIM LINK*\n\n${e.response?.data?.message || e.message}`)
            }
            break
        }

        case 'verifv2': {
            if (!/^https?:\/\/\S+$/i.test(input)) {
                return RaplyGwe(
                    `*VERIFIKASI AM PREMIUM V2*\n\n` +
                    `Format penggunaan:\n` +
                    `${usedPrefix}${command} <link>`
                )
            }

            if (!global.ampremv2.has(m.sender)) {
                return RaplyGwe(
                    `Sesi tidak ditemukan atau sudah kedaluwarsa.\n` +
                    `Silakan ulangi dengan ${usedPrefix}ampremv2 <email>`
                )
            }

            const { email } = global.ampremv2.get(m.sender)

            await react('⏳')
            try {
                const { data } = await api.post('/api/verify-link', { email, magicLink: input })
                if (!data?.success) throw new Error(data?.message || 'Verifikasi gagal.')

                global.ampremv2.delete(m.sender)

                await RaplyGwe(
                    `*VERIFIKASI BERHASIL*\n\n` +
                    `Email  : ${email}\n` +
                    `UID    : ${data.uid || '-'}\n` +
                    `Plan   : ${data.planName || '-'}\n` +
                    `Berlaku: ${data.validUntil || '-'}`
                )
                await react('✅')
            } catch (e) {
                await react('❌')
                await RaplyGwe(`*VERIFIKASI GAGAL*\n\n${e.response?.data?.message || e.message}`)
            }
            break
        }
    }
}

handler.command = ['ampremv2', 'verifv2']
handler.tags = ['tools']
handler.help = ['ampremv2 <email>', 'verifv2 <link>']
handler.owner = true

export default handler
