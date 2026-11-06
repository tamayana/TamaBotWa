let handler = async (m, { conn, groupMetadata, RaplyGwe }) => {
    if (groupMetadata?.announce) return RaplyGwe('Chat grup sudah *tertutup*.')

    await conn.groupSettingUpdate(m.chat, 'announcement')
    await RaplyGwe('Chat grup berhasil *ditutup*, hanya admin yang bisa kirim pesan.')
}

handler.help = ['close']
handler.tags = ['group']
handler.command = /^(close)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
