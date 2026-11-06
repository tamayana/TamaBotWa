let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted?.key?.id) {
        return m.reply(`Balas pesan yang ingin dihapus dengan perintah *${usedPrefix + command}*`)
    }

    try {
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: m.quoted.key.fromMe,
                id: m.quoted.key.id,
                participant: m.quoted.key.participant || m.quoted.sender
            }
        })
        await conn.sendMessage(m.chat, { delete: m.key })
    } catch (e) {
        console.error('[del]', e)
        await m.reply(`❌ *Gagal menghapus pesan:* ${e.message || e}`)
    }
}

handler.help = ['del']
handler.tags = ['group']
handler.command = /^(del|delete|hapus)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
