import config from '../../config.js'
import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

/// ─────────── [ 𝖥𝗂𝗅𝗍𝖾𝗋 𝖫𝗂𝗇𝗄 ] ────────── ///
const LINK_REGEX = /(?:https?:\/\/|www\.)\S+|\b(?:chat\.whatsapp\.com|wa\.me|t\.me)\/\S+/i

// Simpen warn antilink
let warnDB = {}

let handler = async (m, { conn, args, command, usedPrefix, RaplyGwe, isAdmin, isBotAdmin, isOld }) => {
    if (command) {
        if (!m.isGroup) return RaplyGwe(config.accessDenied.group)
        if (!isAdmin && !m.isOwner) return RaplyGwe(config.accessDenied.admin)

        const p = usedPrefix || '.'
        const mode = (args[0] || '').toLowerCase()
        
        try {
            const current = getGroupSettings(m.chat).antilink

            if (!['on', 'off'].includes(mode)) {
                return RaplyGwe(`🔗 Status Antilink: *${current ? 'ON ✅' : 'OFF ❌'}*\n\n*Cara pakai:*\n${p}antilink on\n${p}antilink off`)
            }

            const enable = mode === 'on'
            if (current === enable) return RaplyGwe(`Antilink sudah *${mode.toUpperCase()}* di grup ini.`)

            setGroupSetting(m.chat, 'antilink', enable)
            let text = `✅ Antilink berhasil di *${enable ? 'AKTIFKAN' : 'MATIKAN'}*.`

            if (enable) {
                const fresh = await conn.groupMetadata(m.chat).catch(() => null)
                const botIds = [conn.user?.id, conn.user?.lid].filter(Boolean).map(v => v.replace(/:\d+@/, '@'))
                const botAdmin = fresh?.participants?.some(p => p.admin && [p.id, p.lid].some(v => v && botIds.includes(v.replace(/:\d+@/, '@'))))
                if (!botAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
            }
            return RaplyGwe(text)
        } catch (e) {
            console.log('ANTILINK TOGGLE ERROR:', e.message)
            return RaplyGwe(`❌ Gagal ngatur Antilink: ${e.message}`)
        }
    }

    // === MODE AUTO-DETECT LINK (MARAHIN) ===
    if (!m.isGroup || m.fromMe || m.isOwner || isOld) return
    if (!getGroupSettings(m.chat).antilink) return
    if (!LINK_REGEX.test(m.text || '')) return
    if (isAdmin || !isBotAdmin) return

    const sender = m.sender
    const chatId = m.chat

    try {
        // 1. HAPUS PESAN LINK NYA!
        await conn.sendMessage(chatId, { delete: m.key })

        // 2. TAMBAH WARN!
        if (!warnDB[chatId]) warnDB[chatId] = {}
        if (!warnDB[chatId][sender]) warnDB[chatId][sender] = 0
        warnDB[chatId][sender]++
        const warnCount = warnDB[chatId][sender]

        // 3. BOT MARAHIN!
        if (warnCount >= 3) {
            await conn.sendMessage(chatId, {
                text: `🚨 *KENA KICK! GARA-GARA LINK!* 🚨\n\n@${sender.split('@')[0]} udah 3x kirim link di grup ini!\n\n❌ Pesan dihapus\n❌ Warn 3/3\n❌ LANGSUNG DIKICK!\n\nDibilangin jangan kirim link, masih ngeyel!`,
                mentions: [sender]
            })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            delete warnDB[chatId][sender]
            return
        }

        // PILIH GAYA MARAH NYA DI SINI BUNG! 👇
        // Hapus // di salah satu yang lu mau!

        // --- GAYA 1: SOPAN ---
        // let marahText = `🔗 *Anti Link*\n\n@${sender.split('@')[0]} dilarang kirim link di grup ini ya. Pesan sudah dihapus. Warn ${warnCount}/3.`

        // --- GAYA 2: NGEGAS (RECOMMENDED!) ---
        let marahText = `🔗 *WOY! KETANGKEP KIRIM LINK!* 🔗\n\n`
            + `@${sender.split('@')[0]} ngapain lu kirim link disini?! 😡\n\n`
            + `❌ Link lu udah gua hapus!\n`
            + `⚠️ Warn lu: *${warnCount}/3*\n\n`
            + `Kalo sampe 3x, lu gua KICK!`

        // --- GAYA 3: PEDES BANGET ---
        // let marahText = `EH @${sender.split('@')[0]}! LU KIRA INI GRUP PROMOSI?! MINGGAT LU! LINK LU GUA HAPUS! WARN ${warnCount}/3!`

        await conn.sendMessage(chatId, {
            text: marahText,
            mentions: [sender]
        })

        await conn.sendMessage(chatId, { react: { text: '😡', key: m.key } })

    } catch (e) {
        console.log('ANTILINK EVENT ERROR:', e.message)
    }
}

handler.help = ['antilink <on/off>']
handler.tags = ['group']
handler.command = /^(antilink)$/i
handler.customPrefix = LINK_REGEX

export default handler
