import { isPterodactyl, pteroRequest, pteroError } from '../../lib/panel.js'

let handler = async (m, { args, command, prefix, RaplyGwe }) => {
    if (!isPterodactyl()) return RaplyGwe('𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖣𝗎𝗅𝗎 𝖠𝗉𝗂𝗄𝖾𝗒 𝖯𝖺𝗇𝖾𝗅 𝖡𝗈𝗌𝗌!!')

    const query = (args[0] || '').trim()
    if (!query) return RaplyGwe(`Contoh:\n.deladmin ID admin`) 

    try {
        let user = null
        if (/^\d+$/.test(query)) {
            const res = await pteroRequest(`/api/application/users/${query}`)
            if (res.ok) user = res.data.attributes
        } else {
            const res = await pteroRequest(`/api/application/users?filter[username]=${encodeURIComponent(query.toLowerCase())}`)
            if (res.ok) user = res.data.data.map(v => v.attributes).find(u => u.username === query.toLowerCase()) || null
        }

        if (!user) return RaplyGwe('Admin tidak ditemukan.')
        if (!user.root_admin) return RaplyGwe(`*${user.username}* bukan admin panel.`)

        const del = await pteroRequest(`/api/application/users/${user.id}`, 'DELETE')
        if (!del.ok) return RaplyGwe(`Gagal menghapus admin:\n${pteroError(del)}`)

        await RaplyGwe(`✅ Admin *${user.username}* (ID ${user.id}) berhasil dihapus.`)
    } catch (e) {
        await RaplyGwe(`❌ Error: ${e.message}`)
    }
}

handler.help = ['deladmin <id>']
handler.tags = ['panel']
handler.command = /^(deladmin|deladminpanel)$/i
handler.creator = true

export default handler
