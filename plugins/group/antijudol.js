import { getGroupSettings, setGroupSettings } from '../../lib/database.js'

// Kata-kata judol yang dideteksi
const JUDOL_WORDS = [
    'slot', 'gacor', 'maxwin', 'togel', 'deposit', 'wd', 'withdraw',
    'scatter', 'zeus', 'mahjong', 'pragmatic', 'judol', 'judi online',
    'bonus new member', 'deposit pulsa', 'rtp', 'polaslot', 'link gacor',
    'situs slot', 'daftar slot', 'agen togel', 'bandar togel'
]

let warnDB = {}

// ─── COMMAND: .antijudol on/off/kick ───
let handler = async (m, { conn, args, usedPrefix, command, RaplyGwe }) => {
    if (!args[0]) {
        const cfg = getGroupSettings(m.chat)
        return RaplyGwe(
            `*Anti Judol*\n\n` +
            `Status: ${cfg?.antijudol ? '✅ ON' : '❌ OFF'}${cfg?.antijudolKick ? ' + KICK' : ''}\n\n` +
            `Cara pakai:\n` +
            `${usedPrefix + command} on - Nyalain, hapus pesan + warn\n` +
            `${usedPrefix + command} off - Matiin\n` +
            `${usedPrefix + command} kick - Nyalain + Kick kalo 3x warn`
        )
    }

    const mode = args[0].toLowerCase()
    if (mode === 'on') {
        setGroupSettings(m.chat, { antijudol: true, antijudolKick: false })
        return RaplyGwe(`✅ *Anti Judol ON!*\nPesan judol bakal dihapus + kena warn!`)
    }
    if (mode === 'off') {
        setGroupSettings(m.chat, { antijudol: false, antijudolKick: false })
        return RaplyGwe(`❌ *Anti Judol OFF!*`)
    }
    if (mode === 'kick') {
        setGroupSettings(m.chat, { antijudol: true, antijudolKick: true })
        return RaplyGwe(`✅ *Anti Judol ON + KICK!*\nKalo udah 3x warn, langsung di-kick!`)
    }
    return RaplyGwe(`Pakai: ${usedPrefix + command} on / off / kick`)
}

handler.before = async function (m, { conn }) {
    if (!m.isGroup) return
    if (!m.text) return
    if (m.fromMe) return
    if (m.isAdmin) return

    const cfg = getGroupSettings(m.chat)
    if (!cfg?.antijudol) return

    const text = m.text.toLowerCase()
    const kena = JUDOL_WORDS.some(w => text.includes(w))
    if (!kena) return

    const sender = m.sender
    const chatId = m.chat

    try {
        await conn.sendMessage(chatId, { delete: m.key })

        if (!warnDB[chatId]) warnDB[chatId] = {}
        if (!warnDB[chatId][sender]) warnDB[chatId][sender] = 0
        warnDB[chatId][sender]++
        const warnCount = warnDB[chatId][sender]

        if (cfg.antijudolKick && warnCount >= 3) {
            await conn.sendMessage(chatId, {
                text: `🚨 *KENA KICK!* 🚨\n\n@${sender.split('@')[0]} udah 3x kirim JUDOL di grup ini!\n\n❌ Pesan dihapus\n❌ Kena warn 3/3\n❌ LANGSUNG DIKICK!\n\nBye-bye tukang judol! 👋`,
                mentions: [sender]
            })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            delete warnDB[chatId][sender]
            return
        }

        let merahinText = `🚨 *WOY! KETANGKEP JUDOL!* 🚨\n\n`
            + `@${sender.split('@')[0]} jangan kirim JUDOL di grup ini!\n\n`
            + `❌ Pesan lu udah gua hapus!\n`
            + `⚠️ Warn lu: *${warnCount}/3*\n\n`

        if (cfg.antijudolKick) {
            merahinText += `Kalo sampe 3x, lu gua KICK!`
        } else {
            merahinText += `Kalo masih ngeyel, admin bakal kick lu!`
        }

        await conn.sendMessage(chatId, {
            text: merahinText,
            mentions: [sender]
        })

        await conn.sendMessage(chatId, { react: { text: '😡', key: m.key } })

    } catch (e) {
        console.log('ANTIJUDOL EVENT ERROR:', e.message)
        if (e.message.includes('not-admin') || e.message.includes('403')) {
            await conn.sendMessage(chatId, {
                text: `⚠️ Gua mau hapus pesan judol dari @${sender.split('@')[0]} tapi gua bukan Admin! Jadikan gua Admin dulu!`,
                mentions: [sender]
            })
        }
    }
}

handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
