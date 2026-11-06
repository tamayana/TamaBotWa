import { isPterodactyl, pteroRequest, pteroError } from '../../lib/panel.js'

let handler = async (m, { RaplyGwe }) => {
    if (!isPterodactyl()) return RaplyGwe('𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖣𝗎𝗅𝗎 𝖠𝗉𝗂𝗄𝖾𝗒 𝖯𝖺𝗇𝖾𝗅 𝖡𝗈𝗌𝗌!!')

    try {
        const admins = []
        let page = 1

        while (page <= 20) {
            const res = await pteroRequest(`/api/application/users?page=${page}&per_page=100`)
            if (!res.ok) return RaplyGwe(`Gagal mengambil data:\n${pteroError(res)}`)

            admins.push(...res.data.data.map(v => v.attributes).filter(u => u.root_admin))

            const { current_page, total_pages } = res.data.meta.pagination
            if (current_page >= total_pages) break
            page++
        }

        if (!admins.length) return RaplyGwe('Belum ada admin panel.')

        const list = admins.map((u, i) =>
            `${i + 1}. *${u.username}*
└╼ *ID:* ${u.id}
└╼ *Email:* ${u.email}`
        ).join('\n\n')

        await RaplyGwe(`*𝖫𝗂𝗌𝗍 𝖠𝖽𝗆𝗂𝗇* (total ${admins.length})\n\n${list}`)
    } catch (e) {
        await RaplyGwe(`❌ Error: ${e.message}`)
    }
}

handler.help = ['listadmin']
handler.tags = ['panel']
handler.command = /^(listadmin)$/i
handler.owner = true

export default handler
