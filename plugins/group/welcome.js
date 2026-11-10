import { getGroupSettings } from '../../lib/database.js'

let handler = async (m, { conn }) => {
    // Ini bukan command, ini event!
    // Jadi file ini jalan otomatis kalo ada yang join / leave
}

handler.before = async function (m, { conn }) {
    // Cuma jalan kalo event nya group-participants.update
    if (!m.messageStubType) return

    // 32 = ADA YANG JOIN, 28 = ADA YANG KELUAR / DIKICK
    if (![28, 32].includes(m.messageStubType)) return

    const chatId = m.chat
    const settings = getGroupSettings(chatId)

    // Kalo welcome OFF, bot diem aja!
    if (!settings?.welcome) return

    try {
        const metadata = await conn.groupMetadata(chatId)
        const groupName = metadata.subject || 'Grup ini'
        const participants = m.messageStubParameters || []

        for (let user of participants) {
            const userJid = user
            const userTag = `@${userJid.split('@')[0]}`

            // Ambil foto profil user, kalo gak ada pake default
            let pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
            try {
                pp = await conn.profilePictureUrl(userJid, 'image')
            } catch {}

            if (m.messageStubType === 32) {
                // === ADA YANG JOIN ===
                let text = `👋 *SELAMAT DATANG!*\n\n`
                    + `Halo ${userTag}! Selamat datang di *${groupName}*\n\n`
                    + `Jangan lupa baca deskripsi grup ya!\n`
                    + `Ketik *.menu* buat liat fitur bot!`

                await conn.sendMessage(chatId, {
                    image: { url: pp },
                    caption: text,
                    mentions: [userJid]
                })
            }

            if (m.messageStubType === 28) {
                // === ADA YANG KELUAR ===
                let text = `👋 *SELAMAT TINGGAL!*\n\n`
                    + `${userTag} udah keluar dari *${groupName}*\n`
                    + `Semoga betah di luar sana ya!`

                await conn.sendMessage(chatId, {
                    image: { url: pp },
                    caption: text,
                    mentions: [userJid]
                })
            }
        }
    } catch (e) {
        console.log('WELCOME EVENT ERROR:', e.message)
    }
}

export default handler
