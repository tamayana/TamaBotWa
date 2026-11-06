import axios from 'axios'

const BASE_URL = 'https://satriam.satriadeveloperz.workers.dev'
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Content-Type': 'application/json',
    'Origin': 'https://satriam.satriadeveloperz.workers.dev',
    'Referer': 'https://satriam.satriadeveloperz.workers.dev/'
}
const pendingLogins = new Map()

/// ─────────── [ 𝖠𝖯𝖨 𝖧𝖾𝗅𝗉𝖾𝗋𝗌 ] ────────── ///
const sendMagicLink = async (email) => {
    const { data } = await axios.post(`${BASE_URL}/api/satriam/send-link`, { email }, { headers: HEADERS, timeout: 15000 })
    if (!data?.success) throw new Error(data?.message || 'Gagal mengirim link.')
    return data.message
}

const verifyMagicLink = async (email, magicLink) => {
    const { data } = await axios.post(`${BASE_URL}/api/satriam/verify-link`, { email, magicLink }, { headers: HEADERS, timeout: 15000 })
    if (!data?.success) throw new Error(data?.message || 'Verifikasi gagal.')
    return data
}

/// ─────────── [ 𝖧𝖺𝗇𝖽𝗅𝖾𝗋 𝖴𝗍𝖺𝗆𝖺 ] ────────── ///
let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const query = text.trim()

    /// ─── [ 𝖢𝖮𝖬𝖬𝖠𝖭𝖣: 𝖵𝖤𝖱𝖨𝖥 ] ─── ///
    if (command === 'verif') {
        if (!query) return RaplyGwe(`Kirim link verifikasinya.\nContoh: *${usedPrefix}verif https://...*`)
        if (!query.startsWith('http')) return RaplyGwe('Link tidak valid. Pastikan diawali dengan http/https.')

        if (!pendingLogins.has(m.sender)) {
            return RaplyGwe(`❌ Kamu belum melakukan request magic link.\nSilakan ketik *${usedPrefix}amprem email@gmail.com* terlebih dahulu.`)
        }

        const email = pendingLogins.get(m.sender)
        pendingLogins.delete(m.sender)

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        try {
            const res = await verifyMagicLink(email, query)
            
            const successMsg = `✅ *VERIFIKASI BERHASIL*\n`
                + `📧 *Email:* ${email}\n`
                + `🆔 *UID:* ${res.uid || '-'}\n`
                + `💎 *Plan:* ${res.planName || '-'}\n`
                + `📅 *Valid Until:* ${res.validUntil || '-'}\n\n`
                + `> _Berhasil Upgrade Am Premium._`

            await RaplyGwe(successMsg)
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } catch (e) {
            await RaplyGwe(`❌ *Verifikasi Gagal:* ${e.message}`)
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        }
        return
    }

    /// ─── [ 𝖢𝖮𝖬𝖬𝖠𝖭𝖣: 𝖠𝖬𝖯𝖱𝖤𝖬 ] ─── ///
    if (command === 'amprem') {
        if (!query.includes('@')) {
            return RaplyGwe(`*CARA PENGGUNAAN*\n\nKirim email kamu dengan format:\n*${usedPrefix}amprem email@gmail.com*\n\nContoh:\n*${usedPrefix}amprem ikyyxd12@gmail.com*`)
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        try {
            const message = await sendMagicLink(query)
            pendingLogins.set(m.sender, query)

            const infoMsg = `📧 *MAGIC LINK TERKIRIM*\n\n`
                + `Status: _${message}_\n\n`
                + `👉 Silakan cek kotak masuk (inbox/spam) email *${query}*.\n`
                + `👉 Jika sudah dapat linknya, ketik perintah:\n*${usedPrefix}verif <paste_link_disini>*`

            await RaplyGwe(infoMsg)
            await conn.sendMessage(m.chat, { react: { text: '📩', key: m.key } })
        } catch (e) {
            await RaplyGwe(`❌ *Gagal:* ${e.message}`)
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        }
        return
    }
}

handler.command = ['amprem', 'verif']
handler.tags = ['tools']
handler.help = ['amprem <email>', 'verif <link>']
handler.owner = true

export default handler
