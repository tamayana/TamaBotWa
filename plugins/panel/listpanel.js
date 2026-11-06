import { isPterodactyl, pteroRequest, pteroError, fmtRam, fmtCpu } from '../../lib/panel.js'

let handler = async (m, { args, prefix, RaplyGwe }) => {
    if (!isPterodactyl()) return RaplyGwe('𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖣𝗎𝗅𝗎 𝖠𝗉𝗂𝗄𝖾𝗒 𝖯𝖺𝗇𝖾𝗅 𝖡𝗈𝗌𝗌!!')

    const page = Math.max(parseInt(args[0]) || 1, 1)

    try {
        const res = await pteroRequest(`/api/application/servers?page=${page}&per_page=25`)
        if (!res.ok) return RaplyGwe(`Gagal mengambil data:\n${pteroError(res)}`)

        const { total, total_pages } = res.data.meta.pagination
        if (!total) return RaplyGwe('Belum ada panel.')
        if (page > total_pages) return RaplyGwe(`Halaman ${page} tidak ada. Total halaman: ${total_pages}`)

        const list = res.data.data.map(({ attributes: s }, i) =>
            `${(page - 1) * 25 + i + 1}. *${s.name}*
└╼ *ID:* ${s.id}
└╼ *Ram:* ${fmtRam(s.limits.memory)} • *Disk:* ${fmtRam(s.limits.disk)} • *CPU:* ${fmtCpu(s.limits.cpu)}
└╼ *Status:* ${s.suspended ? 'Suspended' : 'Aktif'}`
        ).join('\n\n')

        const nav = page < total_pages ? `\n\nHalaman berikutnya: ${prefix || '.'}listpanel ${page + 1}` : ''
        await RaplyGwe(`*𝖫𝗂𝗌𝗍 𝖯𝖺𝗇𝖾𝗅* (${page}/${total_pages} • total ${total})\n\n${list}${nav}`)
    } catch (e) {
        await RaplyGwe(`❌ Error: ${e.message}`)
    }
}

handler.help = ['listpanel <halaman>']
handler.tags = ['panel']
handler.command = /^(listpanel|listserver)$/i
handler.owner = true

export default handler
