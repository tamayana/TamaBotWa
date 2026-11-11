let handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = {}
        user = global.db.data.users[m.sender]
    }
    user.afk = Date.now()
    user.afkReason = text || 'tanpa alasan'
    return m.reply(`*AFK AKTIF!* 💤\n\nLu AFK: ${user.afkReason}\nKalo ada yang tag lu, gua yang balesin!`)
}

handler.before = async (m, { conn }) => {
    if (!m.text) return
    let user = global.db.data.users[m.sender]
    // Kalau ada yang ngetag orang AFK
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        for (let jid of m.mentionedJid) {
            let target = global.db.data.users[jid]
            if (target?.afk && jid !== m.sender) {
                let lama = Math.floor((Date.now() - target.afk) / 60000)
                await conn.sendMessage(m.chat, { text: `*DIA LAGI AFK!* 💤\n\n@${jid.split('@')[0]} lagi AFK ${lama} menit yang lalu!\nAlasan: ${target.afkReason}` }, { quoted: m })
            }
        }
    }
    // Kalau yang AFK chat lagi, matiin AFK nya - KECUALI dia ketik .afk lagi
    if (user?.afk && !m.text.toLowerCase().startsWith('.afk') && !m.text.toLowerCase().startsWith('afk') && !m.fromMe) {
        let lama = Math.floor((Date.now() - user.afk) / 60000)
        user.afk = 0
        user.afkReason = ''
        await m.reply(`Welcome back! Lu udah gak AFK lagi! Tadi AFK ${lama} menit!`)
    }
}

handler.help = ['afk']
handler.tags = ['mctama']
handler.command = /^afk$/i
export default handler
