let handler = async (m, { text, conn }) => {
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data.users) global.db.data.users = {}
    
    // Ubah LID -> Nomor HP biar konsisten sama handler.js
    let pn = m.sender
    if (String(pn).endsWith('@lid')) {
        try {
            let getPn = await conn.signalRepository?.lidMapping?.getPNForLID(pn)
            if (getPn) pn = String(getPn).includes('@') ? getPn : getPn + '@s.whatsapp.net'
        } catch {}
    }
    
    // Simpen di 2 tempat biar pasti ketemu: LID + Nomor HP
    for (let key of [...new Set([m.sender, pn])]) {
        if (!global.db.data.users[key]) global.db.data.users[key] = {}
        global.db.data.users[key].afk = Date.now()
        global.db.data.users[key].afkReason = text || 'tanpa alasan'
        global.db.data.users[key].name = m.pushName || m.name || global.db.data.users[key].name || ''
    }
    
    await m.reply(`*AFK AKTIF!* 💤\n\nLu AFK: ${text || 'tanpa alasan'}\nKalo ada yang tag lu, gua yang balesin!`)
}
handler.help = ['afk']
handler.tags = ['mctama']
handler.command = /^afk$/i
export default handler
