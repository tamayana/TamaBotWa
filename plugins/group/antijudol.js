import { getGroupSettings, setGroupSettings } from '../../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const reply = RaplyGwe || m.reply
    const mode = (args[0] || '').toLowerCase()
    const cfg = getGroupSettings(m.chat)
    const label = cfg.antijudol ? (cfg.antijudolKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'

    if (!['on', 'off', 'kick'].includes(mode)) {
        return reply(`Status Anti Judol: *${label}*\n\nContoh:\n${usedPrefix}antijudol on  (hapus pesan)\n${usedPrefix}antijudol kick  (hapus + keluarkan pengirim)\n${usedPrefix}antijudol off`)
    }

    setGroupSettings(m.chat, 'antijudol', mode !== 'off')
    setGroupSettings(m.chat, 'antijudolKick', mode === 'kick')

    let text = mode === 'off'
        ? 'Anti Judol berhasil dimatikan.'
        : `Anti Judol berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return reply(text)
}

// ─── INI MESIN NYA YANG DARI TADI HILANG! GUA TAMBAHIN DI SINI BIAR JADI 1 FILE! ───
async function antijudolAuto(m, { conn }) {
    try {
        if (!m.isGroup) return
        if (!m.text) return
        if (m.fromMe) return
        if (m.text.toLowerCase().startsWith('.antijudol')) return
        if (m.text.toLowerCase().startsWith('antijudol')) return

        const cfg = getGroupSettings(m.chat)
        if (!cfg.antijudol) return

        const text = m.text
        const lower = text.toLowerCase()
        const JUDOL_WORDS = ['slot','gacor','maxwin','togel','deposit','wd','withdraw','scatter','zeus','mahjong','pragmatic','judol','judi online','bonus new member','rtp','polaslot','link gacor','situs slot','daftar slot','agen togel','bandar togel']
        const kenaKata = JUDOL_WORDS.some(w => lower.includes(w))
        const kenaPola =
            text.includes('X10') || text.includes('X5') || text.includes('X20') ||
            (text.includes('%') && text.includes('X')) ||
            text.includes('TO Betting') ||
            /[A-Z]{2,}BET/i.test(text) ||
            /[A-Z]+\d{2,}/.test(text) ||
            /TOTO\d+/i.test(text) ||
            /4D/i.test(text) ||
            /slot\d+/i.test(text) ||
            /toto/i.test(text)
        if (!kenaKata && !kenaPola) return

        const sender = m.sender
        const chatId = m.chat

        await conn.sendMessage(chatId, { delete: m.key })

        if (!global.antijudolWarn) global.antijudolWarn = {}
        if (!global.antijudolWarn[chatId]) global.antijudolWarn[chatId] = {}
        if (!global.antijudolWarn[chatId][sender]) global.antijudolWarn[chatId][sender] = 0
        global.antijudolWarn[chatId][sender]++
        const warnCount = global.antijudolWarn[chatId][sender]

        if (cfg.antijudolKick && warnCount >= 3) {
            await conn.sendMessage(chatId, {
                text: `🚨 *KENA KICK!* 🚨\n\n@${sender.split('@')[0]} udah 3x kirim JUDOL!\n\n❌ Pesan dihapus\n❌ Warn 3/3\n❌ LANGSUNG DIKICK!`,
                mentions: [sender]
            })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            delete global.antijudolWarn[chatId][sender]
            return
        }

        await conn.sendMessage(chatId, {
            text: `🚨 *WOY! KETANGKEP JUDOL!* 🚨\n\n@${sender.split('@')[0]} jangan kirim JUDOL di grup ini!\n\n❌ Pesan lu udah gua hapus!\n⚠️ Warn lu: *${warnCount}/3*`,
            mentions: [sender]
        })
        await conn.sendMessage(chatId, { react: { text: '😡', key: m.key } })
    } catch (e) {
        console.log('ANTIJUDOL ERROR:', e.message)
    }
}

handler.before = antijudolAuto
handler.all = antijudolAuto

handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.group = true
handler.admin = true

export default handler
