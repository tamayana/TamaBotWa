if (!global.antijudolDB) global.antijudolDB = {}
if (!global.antijudolWarn) global.antijudolWarn = {}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chatId = m.chat
    if (!global.antijudolDB[chatId]) global.antijudolDB[chatId] = { on: true, kick: true }
    let cfg = global.antijudolDB[chatId]

    if (!args[0]) {
        return m.reply(
            `*🚨 ANTI JUDOL*\n\n` +
            `Status: ${cfg.on ? '✅ ON' : '❌ OFF'}${cfg.kick ? ' + KICK' : ''}\n` +
            `Warn: 3x = Kick!\n\n` +
            `Cara pakai:\n` +
            `${usedPrefix + command} on - Nyalain\n` +
            `${usedPrefix + command} kick - Nyalain + Kick\n` +
            `${usedPrefix + command} off - Matiin`
        )
    }
    let mode = args[0].toLowerCase()
    if (mode === 'on') {
        global.antijudolDB[chatId] = { on: true, kick: false }
        return m.reply('✅ *Anti Judol ON!*')
    }
    if (mode === 'kick') {
        global.antijudolDB[chatId] = { on: true, kick: true }
        return m.reply('✅ *Anti Judol ON + KICK!*')
    }
    if (mode === 'off') {
        global.antijudolDB[chatId] = { on: false, kick: false }
        return m.reply('❌ *Anti Judol OFF!*')
    }
}

handler.before = async function (m, { conn }) {
    if (!m.isGroup) return
    if (!m.text) return
    if (m.fromMe) return
    let chatId = m.chat
    if (!global.antijudolDB[chatId]) global.antijudolDB[chatId] = { on: true, kick: true }
    let cfg = global.antijudolDB[chatId]
    if (!cfg.on) return

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
    try {
        await conn.sendMessage(chatId, { delete: m.key })
        if (!global.antijudolWarn[chatId]) global.antijudolWarn[chatId] = {}
        if (!global.antijudolWarn[chatId][sender]) global.antijudolWarn[chatId][sender] = 0
        global.antijudolWarn[chatId][sender]++
        const warnCount = global.antijudolWarn[chatId][sender]
        if (cfg.kick && warnCount >= 3) {
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

handler.help = ['antijudol <on/kick/off>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.group = false
handler.admin = false
handler.botAdmin = false

export default handler
