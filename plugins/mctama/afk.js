let handler = async (m, { conn }) => {
    let txt = (m.text || '').trim()
    let lower = txt.toLowerCase()
    
    // Biar gak error kalau db belum ada
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}

    // 1. KALO LU KETIK .afk -> AKTIFIN AFK
    if (lower === 'afk' || lower.startsWith('afk ') || lower.startsWith('.afk')) {
        let alasan = txt.replace(/^\.?afk\s*/i, '').trim() || 'tanpa alasan'
        let user = global.db.data.users[m.sender]
        user.afk = Date.now()
        user.afkReason = alasan
        await conn.sendMessage(m.chat, { text: `*AFK AKTIF!* 💤\n\nLu AFK: ${alasan}\nKalo ada yang tag lu, gua yang balesin!` }, { quoted: m })
        return
    }

    // 2. KALO ADA YANG NGETAG ORANG YANG LAGI AFK -> BALESIN
    let mentioned = m.mentionedJid || []
    // Cadangan: kalau mentionedJid kosong, cek manual dari text yang ada @
    if (mentioned.length > 0) {
        for (let jid of mentioned) {
            if (jid === m.sender) continue
            let target = global.db.data.users[jid]
            if (target?.afk) {
                let lama = Math.floor((Date.now() - target.afk) / 60000)
                let lamaTxt = lama < 1 ? 'baru aja' : `${lama} menit yang lalu`
                await conn.sendMessage(m.chat, { text: `*DIA LAGI AFK!* 💤\n\n@${jid.split('@')[0]} lagi AFK ${lamaTxt}!\nAlasan: ${target.afkReason}\n\nJangan diganggu dulu!` }, { quoted: m })
            }
        }
    }

    // 3. KALO YANG AFK CHAT LAGI -> MATIIN AFK NYA
    let me = global.db.data.users[m.sender]
    if (me?.afk && !m.fromMe) {
        // Jangan matiin kalau yang ngirim bot sendiri
        let lama = Math.floor((Date.now() - me.afk) / 60000)
        me.afk = 0
        me.afkReason = ''
        await conn.sendMessage(m.chat, { text: `Welcome back! Lu udah gak AFK lagi! Tadi AFK ${lama} menit!` }, { quoted: m })
    }
}

handler.all = handler
handler.help = ['afk']
handler.tags = ['mctama']
handler.command = /^afk$/i
export default handler
