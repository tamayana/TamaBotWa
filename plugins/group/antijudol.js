// plugins/group/antijudol.js - FINAL NO IMPORT! DIJAMIN KE-LOAD!
if (!global.antijudolDB) global.antijudolDB = {}
if (!global.antijudolWarn) global.antijudolWarn = {}

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const reply = RaplyGwe || m.reply
    const mode = (args[0] || '').toLowerCase()
    if (!global.antijudolDB[m.chat]) global.antijudolDB[m.chat] = { antijudol: false, antijudolKick: false }
    const cfg = global.antijudolDB[m.chat]
    const label = cfg.antijudol ? (cfg.antijudolKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'
    if (!['on', 'off', 'kick'].includes(mode)) {
        return reply(`Status Anti Judol: *${label}*\n\nContoh:\n${usedPrefix}antijudol on\n${usedPrefix}antijudol kick\n${usedPrefix}antijudol off`)
    }
    global.antijudolDB[m.chat] = { antijudol: mode !== 'off', antijudolKick: mode === 'kick' }
    let text = mode === 'off' ? 'Anti Judol berhasil dimatikan.' : `Anti Judol berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return reply(text)
}

async function antijudolAuto(m, { conn }) {
    try {
        if (!m.isGroup) return
        if (!m.text) return
        if (m.fromMe) return
        if (m.text.toLowerCase().startsWith('.antijudol')) return
        if (!global.antijudolDB[m.chat]) global.antijudolDB[m.chat] = { antijudol: false, antijudolKick: false }
        const cfg = global.antijudolDB[m.chat]
        if (!cfg.antijudol) return
        const text = m.text
        const lower = text.toLowerCase()
        const JUDOL_WORDS = ['slot','gacor','maxwin','togel','deposit','wd','withdraw','scatter','zeus','mahjong','pragmatic','judol','judi online','bonus new member','rtp','polaslot','link gacor','situs slot','daftar slot','agen togel','bandar togel']
        const kenaKata = JUDOL_WORDS.some(w => lower.includes(w))
        const kenaPola = text.includes('X10') || text.includes('X5') || text.includes('X20') || (text.includes('%') && text.includes('X')) || text.includes('TO Betting') || /[A-Z]{2,}BET/i.test(text) || /[A-Z]+\d{2,}/.test(text) || /TOTO\d+/i.test(text) || /4D/i.test(text) || /slot\d+/i.test(text) || /toto/i.test(text)
        if (!kenaKata && !kenaPola) return
        const sender = m.sender
        const chatId = m.chat
        await conn.sendMessage(chatId, { delete: m.key })
        if (!global.antijudolWarn[chatId]) global.antijudolWarn[chatId] = {}
        if (!global.antijudolWarn[chatId][sender]) global.antijudolWarn[chatId][sender] = 0
        global.antijudolWarn[chatId][sender]++
        const warnCount = global.antijudolWarn[chatId][sender]
        if (cfg.antijudolKick && warnCount >= 3) {
            await conn.sendMessage(chatId, { text: `🚨 *KENA KICK!* 🚨\n\n@${sender.split('@')[0]} udah 3x kirim JUDOL!\n\n❌ Pesan dihapus\n❌ Warn 3/3\n❌ LANGSUNG DIKICK!`, mentions: [sender] })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            delete global.antijudolWarn[chatId][sender]
            return
        }
        const marahList = [
            `🚨 *WOY TOLOL! KETANGKEP JUDOL!* 🚨\n\n@${sender.split('@')[0]} Otak lu di mana?! Ngapain kirim JUDOL di sini?!\n\n❌ Pesan sampah lu udah gua hapus!\n⚠️ Warn lu: *${warnCount}/3*`,
            `😡 *EH BABI!* 😡\n\n@${sender.split('@')[0]} lu kira ini grup bandar?! Hah?!\n\n❌ Pesan lu gua hapus!\n⚠️ Warn: *${warnCount}/3*`,
            `🤬 *WOY ANJING!* 🤬\n\n@${sender.split('@')[0]} STOP KIRIM JUDOL!\n\n❌ Dihapus!\n⚠️ Warn: *${warnCount}/3*`,
            `🖕 *WOY SAMPAH!* 🖕\n\n@${sender.split('@')[0]} lu jualan judol di sini? Lu mau gua laporin ke polisi?!\n\n❌ Pesan lu udah gua hapus!\n⚠️ Warn: *${warnCount}/3*`
        ]
        const marah = marahList[Math.floor(Math.random() * marahList.length)]
        await conn.sendMessage(chatId, { text: marah, mentions: [sender] })
        await conn.sendMessage(chatId, { react: { text: '😡', key: m.key } })
    } catch (e) { console.log('ANTIJUDOL ERROR:', e.message) }
}

handler.before = antijudolAuto
handler.all = antijudolAuto
handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.group = true
handler.admin = true
export default handler
