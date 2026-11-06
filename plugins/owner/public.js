import config from '../../config.js'
import { setBotMode } from '../../lib/database.js'

let handler = async (m, { conn, RaplyGwe }) => {
    if (config.botMode === 'public') return RaplyGwe('Bot sudah dalam mode Public.')

    setBotMode('public')
    conn.public = true
    await RaplyGwe('Bot mode berhasil diubah ke Public.')
}

handler.help = ['public']
handler.tags = ['owner']
handler.command = /^(public)$/i
handler.owner = true

export default handler