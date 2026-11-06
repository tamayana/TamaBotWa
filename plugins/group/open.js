let handler = async (m, { conn, groupMetadata, RaplyGwe }) => {
    if (groupMetadata && !groupMetadata.announce) return RaplyGwe('Chat grup sudah *terbuka*.')

    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    await RaplyGwe('Chat grup berhasil *dibuka*, semua member bisa kirim pesan.')
}

handler.help = ['open']
handler.tags = ['group']
handler.command = /^(open)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
