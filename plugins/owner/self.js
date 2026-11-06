import config from '../../config.js'
import { setBotMode } from '../../lib/database.js'

let handler = async (m, { conn, RaplyGwe }) => {
    if (config.botMode === 'self') return RaplyGwe('Bot sudah dalam mode Self.')

    setBotMode('self')
    conn.public = false
    await RaplyGwe('Bot mode berhasil diubah ke Self.')
}

handler.help = ['self']
handler.tags = ['owner']
handler.command = /^(self)$/i
handler.owner = true

export default handler