let handler = async (m, { conn, text, command }) => {
    let user = global.db.data.users[m.sender]
    if (!user) return
    if (command === 'afk') {
        user.afk = Date.now()
        user.afkReason = text || 'tanpa alasan'
        return m.reply(`*AFK AKTIF!* 💤\n\nLu AFK: ${user.afkReason}\nKalo ada yang tag lu, gua yang balesin!`)
    }
}
handler.before = async (m, { conn }) => {
    if (!m.mentionedJid) return
    for (let jid of m.mentionedJid) {
        let user = global.db.data.users[jid]
        if (user?.afk) {
            let lama = Math.floor((Date.now() - user.afk) / 60000)
            await conn.sendMessage(m.chat, { text: `*DIA LAGI AFK!* 💤\n\n@${jid.split('@')[0]} lagi AFK ${lama} menit yang lalu!\nAlasan: ${user.afkReason}` }, { quoted: m })
        }
    }
    let sender = global.db.data.users[m.sender]
    if (sender?.afk && !m.text?.toLowerCase().startsWith('.afk')) {
        sender.afk = 0
        sender.afkReason = ''
        await m.reply('Welcome back! AFK lu udah gua matiin!')
    }
}
handler.help = ['afk']
handler.tags = ['mctama']
handler.command = /^afk$/i
export default handler
