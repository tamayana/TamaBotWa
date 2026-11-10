import config from '../../config.js'
import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

const JUDOL_REGEX = /(JNBET|WDBOS|SLOT|GACOR|TOGEL|TOTO|MAXWIN|DEPOSIT|WD|SCATTER|MAHJONG|BANDAR|JUDI|BET|BONUS|PROMO|RTP|POLA|ZEUS|OLYMPUS)/i

let warnDB = {}

let handler = async (m, { conn, args, command, usedPrefix, RaplyGwe, isAdmin, isBotAdmin, isOld }) => {
    if (command) {
        if (!m.isGroup) return RaplyGwe(config.accessDenied.group)
        if (!isAdmin && !m.isOwner) return RaplyGwe(config.accessDenied.admin)
        const p = usedPrefix || '.'
        const mode = (args[0] || '').toLowerCase()
        try {
            const current = getGroupSettings(m.chat).antijudol
            if (!['on', 'off', 'kick'].includes(mode)) {
                return RaplyGwe(`🎰 Status Anti Judol: *${current ? 'ON ✅' : 'OFF ❌'}*\n\n*Cara pakai:*\n${p}antijudol on\n${p}antijudol kick\n${p}antijudol off`)
            }
            const enable = mode !== 'off'
            const kickMode = mode === 'kick'
            setGroupSetting(m.chat, 'antijudol', enable)
            setGroupSetting(m.chat, 'antijudolKick', kickMode)
            let text = `✅ Anti Judol berhasil di *${enable ? 'AKTIFKAN' : 'MATIKAN'}*${kickMode ? ' (mode hapus + kick)' : ''}.`
            if (enable && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
            return RaplyGwe(text)
        } catch (e) {
            return RaplyGwe(`❌ Gagal ngatur Anti Judol: ${e.message}`)
        }
    }

    // === AUTO-DETECT JUDOL ===
    if (!m.isGroup || m.fromMe || m.isOwner || isOld) return
    if (!getGroupSettings(m.chat).antijudol) return
    if (!JUDOL_REGEX.test(m.text || '')) return
    if (isAdmin || !isBotAdmin) return

    const sender = m.sender
    const chatId = m.chat
    try {
        await conn.sendMessage(chatId, { delete: m.key })

        if (getGroupSettings(m.chat).antijudolKick) {
            await conn.sendMessage(chatId, { text: `🚨 *KENA KICK! GARA-GARA JUDOL!* 🚨\n\n@${sender.split('@')[0]} ketangkep kirim JUDOL!\n\n❌ Pesan dihapus\n❌ LANGSUNG DIKICK!`, mentions: [sender] })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            return
        }

        if (!warnDB[chatId]) warnDB[chatId] = {}
        if (!warnDB[chatId][sender]) warnDB[chatId][sender] = 0
        warnDB[chatId][sender]++
        const warnCount = warnDB[chatId][sender]

        if (warnCount >= 3) {
            await conn.sendMessage(chatId, { text: `🚨 *KENA KICK! GARA-GARA JUDOL!* 🚨\n\n@${sender.split('@')[0]} udah 3x kirim judol!\n\n❌ Pesan dihapus\n❌ Warn 3/3\n❌ LANGSUNG DIKICK!`, mentions: [sender] })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            delete warnDB[chatId][sender]
            return
        }

        const marahList = [
            `🚨 *WOY TOLOL! KETANGKEP JUDOL!* 🚨\n\n@${sender.split('@')[0]} Otak lu di mana?! Ngapain kirim JUDOL di sini?!\n\n❌ Pesan sampah lu udah gua hapus!\n⚠️ Warn lu: *${warnCount}/3*`,
            `😡 *EH BABI!* 😡\n\n@${sender.split('@')[0]} lu kira ini grup bandar?! Hah?!\n\n❌ Pesan lu gua hapus!\n⚠️ Warn: *${warnCount}/3*`,
            `🤬 *WOY ANJING!* 🤬\n\n@${sender.split('@')[0]} STOP KIRIM JUDOL! LU PIKIR GRUP INI TEMPAT JUALAN TOGEL?!\n\n❌ Dihapus!\n⚠️ Warn: *${warnCount}/3*`
        ]
        const marahText = marahList[Math.floor(Math.random() * marahList.length)]
        await conn.sendMessage(chatId, { text: marahText, mentions: [sender] })
        await conn.sendMessage(chatId, { react: { text: '😡', key: m.key } })
    } catch (e) {
        console.log('ANTIJUDOL EVENT ERROR:', e.message)
    }
}

handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.customPrefix = JUDOL_REGEX

export default handler
