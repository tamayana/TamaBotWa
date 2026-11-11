let handler = async (m, { text }) => {
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
    let user = global.db.data.users[m.sender]
    user.afk = Date.now()
    user.afkReason = text || 'tanpa alasan'
    await m.reply(`*AFK AKTIF!* 💤\n\nLu AFK: ${user.afkReason}\nKalo ada yang tag lu, gua yang balesin!`)
}
handler.help = ['afk']
handler.tags = ['mctama']
handler.command = /^afk$/i
export default handler
