import config from '../../config.js'
import { setBotMode } from '../../lib/database.js'

let handler = async (m, { conn, RaplyGwe, isOwner }) => {
    try {
        // CUMA OWNER! MEMBER DIEM AJA, NONTON AJA!
        if (!isOwner) return RaplyGwe(`🤫 *ACCESS DENIED!*\n\nLu bukan owner, lu member. Diem aja, nonton aja.`)

        if (config.botMode === 'public') return RaplyGwe('📢 Bot sudah dalam mode *Public*.')

        setBotMode('public')
        config.botMode = 'public' // UPDATE CONFIG NYA JUGA BIAR LANGSUNG KEPAKE!
        conn.public = true

        await RaplyGwe('📢 Bot mode berhasil diubah ke *Public*.\n\nSekarang bot bisa dipake semua orang!')
    } catch (e) {
        console.log('PUBLIC MODE ERROR:', e.message)
        return RaplyGwe(`❌ Gagal ubah ke mode Public: ${e.message}`)
    }
}

handler.help = ['public']
handler.tags = ['owner']
handler.command = /^(public)$/i
handler.owner = true

export default handler
