import config from '../../config.js'
import { setBotMode } from '../../lib/database.js'

let handler = async (m, { conn, RaplyGwe, isOwner }) => {
    try {
        // CUMA OWNER! MEMBER DIEM AJA, NONTON AJA!
        if (!isOwner) return RaplyGwe(`🤫 *ACCESS DENIED!*\n\nLu bukan owner, lu member. Diem aja, nonton aja.`)

        if (config.botMode === 'self') return RaplyGwe('🤫 Bot sudah dalam mode *Self*.')

        setBotMode('self')
        config.botMode = 'self'
        conn.public = false

        await RaplyGwe('🤫 Bot mode berhasil diubah ke *Self*.\n\nSekarang bot cuma respon owner doang!')
    } catch (e) {
        console.log('SELF MODE ERROR:', e.message)
        return RaplyGwe(`❌ Gagal ubah ke mode Self: ${e.message}`)
    }
}

handler.help = ['self']
handler.tags = ['owner']
handler.command = /^(self)$/i
handler.owner = true

export default handler
