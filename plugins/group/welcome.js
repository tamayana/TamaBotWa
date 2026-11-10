import { getGroupSettings } from '../../lib/database.js'

let handler = async (m, { conn }) => {
    // Ini event, bukan command!
    // Jangan ketik .welcome disini, .welcome on/off ada di toggle.js!
}

handler.before = async function (m, { conn }) {
    // === JALUR 1: LEWAT group-participants.update (DARI index.js) ===
    // m.action = 'add' / 'remove', m.participants = [jid], m.id = chatId
    // === JALUR 2: LEWAT messageStubType (JALUR LAMA) ===
    // m.messageStubType = 32 (join) / 28 (leave)

    let isJoin = false
    let isLeave = false
    let chatId = m.chat || m.id
    let participants = []

    if (m.action && m.participants) {
        // Jalur baru dari index.js!
        if (m.action === 'add') isJoin = true
        if (m.action === 'remove') isLeave = true
        participants = m.participants || []
        chatId = m.id || m.chat
    } else if (m.messageStubType) {
        // Jalur lama!
        if (m.messageStubType === 32) isJoin = true
        if (m.messageStubType === 28) isLeave = true
        participants = m.messageStubParameters || []
        chatId = m.chat
    } else {
        return
    }

    if (!isJoin && !isLeave) return
    if (!chatId || !participants.length) return

    const settings = getGroupSettings(chatId)
    // Kalo welcome OFF, bot diem aja!
    if (!settings?.welcome) return

    try {
        const metadata = await conn.groupMetadata(chatId)
        const groupName = metadata.subject || 'Grup ini'

        for (let user of participants) {
            const userJid = typeof user === 'string' ? user : user.id || user
            const userTag = `@${userJid.split('@')[0]}`

            let pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
            try {
                pp = await conn.profilePictureUrl(userJid, 'image')
            } catch {}

            if (isJoin) {
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

            if (isLeave) {
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
