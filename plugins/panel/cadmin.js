import crypto from 'crypto'
import { isPterodactyl, pteroRequest, pteroError, capital, sendAccount } from '../../lib/panel.js'

let handler = async (m, { conn, text, command, prefix, RaplyGwe }) => {
    if (!isPterodactyl()) return RaplyGwe('𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖣𝗎𝗅𝗎 𝖠𝗉𝗂𝗄𝖾𝗒 𝖯𝖺𝗇𝖾𝗅 𝖡𝗈𝗌𝗌!!')

    const username = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!username) return RaplyGwe(`Contoh:\n${prefix || '.'}${command} username`)

    try {
        const password = username + crypto.randomBytes(2).toString('hex')

        const res = await pteroRequest('/api/application/users', 'POST', {
            email: username + '@gmail.com',
            username,
            first_name: capital(username),
            last_name: 'Admin',
            root_admin: true,
            language: 'en',
            password
        })
        if (!res.ok) return RaplyGwe(`Gagal membuat admin:\n${pteroError(res)}`)

        const user = res.data.attributes
        const target = m.isGroup ? m.sender : m.chat
        if (m.isGroup) {
            await RaplyGwe('*Berhasil membuat admin panel ✅*\n`Data akun sudah di kirim ke private chat`')
        }

        await sendAccount(conn, { chat: target, fallback: m.sender, user, password })
    } catch (e) {
        await RaplyGwe(`❌ Error: ${e.message}`)
    }
}

handler.help = ['cadmin <username>']
handler.tags = ['panel']
handler.command = /^(cadmin|createadmin)$/i
handler.creator = true

export default handler
