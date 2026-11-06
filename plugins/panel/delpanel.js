import { isPterodactyl, pteroRequest, pteroError } from '../../lib/panel.js'

let handler = async (m, { args, command, prefix, RaplyGwe }) => {
    if (!isPterodactyl()) return RaplyGwe('𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖣𝗎𝗅𝗎 𝖠𝗉𝗂𝗄𝖾𝗒 𝖯𝖺𝗇𝖾𝗅 𝖡𝗈𝗌𝗌!!')

    const id = parseInt(args[0])
    if (!id) return RaplyGwe(`Contoh:\n.delpanel ID Panel`)

    try {
        const srv = await pteroRequest(`/api/application/servers/${id}`)
        if (!srv.ok) return RaplyGwe(`Server dengan ID ${id} tidak ditemukan.`)

        const { name, user: userId } = srv.data.attributes

        const del = await pteroRequest(`/api/application/servers/${id}`, 'DELETE')
        if (!del.ok) return RaplyGwe(`Gagal menghapus server:\n${pteroError(del)}`)
        let note = ''
        const usr = await pteroRequest(`/api/application/users/${userId}?include=servers`)
        if (usr.ok) {
            const { username, root_admin, relationships } = usr.data.attributes
            const sisa = relationships?.servers?.data?.length || 0
            if (!root_admin && sisa === 0) {
                const delUser = await pteroRequest(`/api/application/users/${userId}`, 'DELETE')
                note = delUser.ok ? `\nAkun user *${username}* ikut dihapus.` : `\nAkun user *${username}* gagal dihapus.`
            }
        }

        await RaplyGwe(`✅ Server *${name}* (ID ${id}) berhasil dihapus.${note}`)
    } catch (e) {
        await RaplyGwe(`❌ Error: ${e.message}`)
    }
}

handler.help = ['delpanel <id>']
handler.tags = ['panel']
handler.command = /^(delpanel|delserver)$/i
handler.owner = true

export default handler
