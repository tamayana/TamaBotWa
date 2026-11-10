import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

// Kata-kata judol yang dideteksi
const JUDOL_WORDS = [
    'slot', 'gacor', 'maxwin', 'togel', 'deposit', 'wd', 'withdraw',
    'scatter', 'zeus', 'mahjong', 'pragmatic', 'judol', 'judi online',
    'bonus new member', 'deposit pulsa', 'rtp', 'polaslot', 'link gacor',
    'situs slot', 'daftar slot', 'agen togel', 'bandar togel'
]

// Simpen warn sementara, biar kalo bot restart ke-reset (kalo mau permanen, simpen di database.js)
let warnDB = {}

let handler = async (m, { conn }) => {}

handler.before = async function (m, { conn }) {
    if (!m.isGroup) return
    if (!m.text) return
    if (m.fromMe) return
    if (m.isAdmin) return // Admin bebas, biar gak kena razia sendiri 😅

    const cfg = getGroupSettings(m.chat)
    if (!cfg?.antijudol) return // Kalo antijudol OFF, bot diem aja

    const text = m.text.toLowerCase()

    // Cek ada kata judol gak?
    const kena = JUDOL_WORDS.some(w => text.includes(w))
    if (!kena) return

    const sender = m.sender
    const chatId = m.chat

    try {
        // 1. HAPUS PESAN JUDOL NYA!
        await conn.sendMessage(chatId, { delete: m.key })

        // 2. TAMBAH WARN!
        if (!warnDB[chatId]) warnDB[chatId] = {}
        if (!warnDB[chatId][sender]) warnDB[chatId][sender] = 0
        warnDB[chatId][sender]++
        const warnCount = warnDB[chatId][sender]

        // 3. BOT MERAHIN DIA!
        if (cfg.antijudolKick && warnCount >= 3) {
            // UDAH 3X, LANGSUNG KICK!
            await conn.sendMessage(chatId, {
                text: `🚨 *KENA KICK!* 🚨\n\n@${sender.split('@')[0]} udah 3x kirim JUDOL di grup ini!\n\n❌ Pesan dihapus\n❌ Kena warn 3/3\n❌ LANGSUNG DIKICK!\n\nBye-bye tukang judol! 👋`,
                mentions: [sender]
            })
            await conn.groupParticipantsUpdate(chatId, [sender], 'remove')
            delete warnDB[chatId][sender]
            return
        }

        // KALO BELUM 3X, MERAHIN AJA!
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

        // Kasih react marah biar makin malu 😂
        await conn.sendMessage(chatId, { react: { text: '😡', key: m.key } })

    } catch (e) {
        console.log('ANTIJUDOL EVENT ERROR:', e.message)
        // Kalo gagal hapus, berarti bot bukan admin!
        if (e.message.includes('not-admin') || e.message.includes('403')) {
            await conn.sendMessage(chatId, {
                text: `⚠️ Gua mau hapus pesan judol dari @${sender.split('@')[0]} tapi gua bukan Admin! Jadikan gua Admin dulu!`,
                mentions: [sender]
            })
        }
    }
}

export default handler
