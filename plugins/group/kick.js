let handler = async (m, { conn, prefix, targets, participants, groupMetadata, botJids, RaplyGwe }) => {
    if (!targets.length) {
        const p = prefix || '.'
        return RaplyGwe(`Tag atau reply member yang mau dikeluarkan.\n\nContoh:\n${p}kick @tag\n${p}kick (reply pesan)\n${p}kick 628xxx`)
    }

    if (!groupMetadata) return RaplyGwe('Gagal mengambil data grup, coba lagi.')

    const norm = (v) => String(v || '').replace(/:\d+@/, '@')
    const owner = norm(groupMetadata.owner)

    const members = [], skipped = []
    for (const id of targets) {
        const p = participants.find(u => [u.id, u.lid, u.jid, u.phoneNumber].some(v => v && norm(v) === norm(id)))
        if (!p) skipped.push(`${id.split('@')[0]} (bukan anggota grup)`)
        else if (botJids.includes(norm(p.id)) || botJids.includes(norm(p.lid))) skipped.push('bot sendiri')
        else if (p.admin === 'superadmin' || norm(p.id) === owner) skipped.push(`${p.tag} (pembuat grup)`)
        else members.push(p)
    }
    if (!members.length) return RaplyGwe(`Tidak ada yang bisa dikeluarkan:\n- ${skipped.join('\n- ')}`)

    const res = await conn.groupParticipantsUpdate(m.chat, members.map(p => p.id), 'remove')

    const ok = members.filter((p, i) => String(res?.[i]?.status || '200') === '200')
    const fail = members.filter(p => !ok.includes(p))

    let text = ok.length ? `*Kick*\n${ok.map(p => p.tag).join(', ')} berhasil dikeluarkan dari grup.` : '*Kick*\nGagal mengeluarkan member.'
    if (fail.length) text += `\n\nGagal: ${fail.map(p => p.tag).join(', ')}`
    if (skipped.length) text += `\n\nDilewati:\n ${skipped.join('\n- ')}`

    await conn.sendMessage(m.chat, {
        text,
        mentions: members.map(p => p.id)
    }, { quoted: m })
}

handler.help = ['kick <@tag>']
handler.tags = ['group']
handler.command = /^(kick)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
