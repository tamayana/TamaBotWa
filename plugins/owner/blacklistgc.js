import { addBlacklistGc, delBlacklistGc, getBlacklistGc } from '../../lib/database.js'
import { resolveGroupTarget } from '../../lib/myfunc.js'

let handler = async (m, { conn, args, command, prefix, RaplyGwe }) => {
    const p = prefix || '.'
    const isList = command.startsWith('list')
    const isDel = command.startsWith('del')
    const list = getBlacklistGc()

    const nameOf = async (jid) => {
        const meta = await conn.groupMetadata(jid).catch(() => null)
        return meta?.subject || null
    }

    if (isList) {
        if (!list.length) return RaplyGwe('Blacklist grup masih kosong.')

        const names = {}
        try {
            const all = await conn.groupFetchAllParticipating()
            for (const g of Object.values(all || {})) names[g.id] = g.subject
        } catch {}

        const rows = list.map((id, i) => `${i + 1}. ${names[id] || 'Nama tidak diketahui'}\n    ${id}`)
        return RaplyGwe(`*Daftar Blacklist Grup JPM* (${list.length})\n\n${rows.join('\n')}\n\nHapus: ${p}delblgc <nomor/id/link>`)
    }

    const input = (args[0] || '').trim()
    let jid = null

    if (isDel && /^\d{1,4}$/.test(input) && Number(input) >= 1 && Number(input) <= list.length) {
        jid = list[Number(input) - 1]
    } else {
        try {
            jid = await resolveGroupTarget(conn, input, m.isGroup ? m.chat : null)
        } catch (e) {
            return RaplyGwe(`Gagal membaca grup dari link: ${e?.message || e}`)
        }
    }

    if (!jid) {
        return RaplyGwe(isDel
            ? `Ketik ${p}${command} langsung di dalam grup, atau masukkan nomor urut (lihat ${p}listblgc), id grup, atau link grup.`
            : `Ketik ${p}${command} langsung di dalam grup, atau masukkan id / link grup.`)
    }

    const name = await nameOf(jid)
    const label = name ? `*${name}*\n${jid}` : jid

    if (isDel) {
        if (!delBlacklistGc(jid)) return RaplyGwe('Grup itu tidak ada di blacklist.')
        return RaplyGwe(`✅ Grup dihapus dari blacklist JPM:\n${label}`)
    }

    if (!addBlacklistGc(jid)) return RaplyGwe('Grup itu sudah ada di blacklist.')
    await RaplyGwe(`✅ Grup masuk blacklist JPM (tidak akan dikirimi jpm):\n${label}`)
}

handler.help = ['blgc', 'delblgc', 'listblgc']
handler.tags = ['jpm']
handler.command = /^(blgc|blacklistgc|delblgc|delblacklistgc|listblgc|listblacklistgc)$/i
handler.owner = true

export default handler
