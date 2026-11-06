let handler = async (m, { conn, prefix, targets, participants, groupMetadata, RaplyGwe }) => {
    if (!targets.length) {
        const p = prefix || '.'
        return RaplyGwe(`Contoh:\n${p}promote @tag\n${p}promote (reply pesan)\n${p}promote 628xxx`)
    }

    if (!groupMetadata) return RaplyGwe('Gagal mengambil data grup, coba lagi.')

    const norm = (v) => String(v || '').replace(/:\d+@/, '@')
    const members = [], skipped = []
    for (const id of targets) {
        const p = participants.find(u => [u.id, u.lid, u.jid, u.phoneNumber].some(v => v && norm(v) === norm(id)))
        if (!p) skipped.push(`${id.split('@')[0]} (bukan anggota grup)`)
        else if (p.admin) skipped.push(`${p.tag} (sudah admin)`)
        else members.push(p)
    }
    if (!members.length) return RaplyGwe(`Tidak ada yang bisa dipromote:\n- ${skipped.join('\n- ')}`)

    const res = await conn.groupParticipantsUpdate(m.chat, members.map(p => p.id), 'promote')

    const ok = members.filter((p, i) => String(res?.[i]?.status || '200') === '200')
    const fail = members.filter(p => !ok.includes(p))

    let text = ok.length ? `*Promote*\n${ok.map(p => p.tag).join(', ')} sekarang jadi *admin* grup.` : '*Promote*\nGagal menjadikan admin.'
    if (fail.length) text += `\n\nGagal: ${fail.map(p => p.tag).join(', ')}`
    if (skipped.length) text += `\n\nDilewati:\n- ${skipped.join('\n- ')}`

    await conn.sendMessage(m.chat, {
        text,
        mentions: members.map(p => p.id)
    }, { quoted: m })
}

handler.help = ['promote <@tag>']
handler.tags = ['group']
handler.command = /^(promote)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
