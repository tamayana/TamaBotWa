let handler = async (m, { conn, usedPrefix, targets, participants, groupMetadata, botJids, RaplyGwe }) => {
    const p = usedPrefix || '.'

    if (!targets.length) {
        return RaplyGwe(`👢 *Tag atau reply member yang mau dikeluarkan.*\n\n*Contoh:*\n${p}kick @tag\n${p}kick (reply pesan)\n${p}kick 628xxx`)
    }

    if (!groupMetadata) return RaplyGwe('❌ Gagal mengambil data grup, coba lagi.')

    try {
        const norm = (v) => String(v || '').replace(/:\d+@/, '@')
        const owner = norm(groupMetadata.owner)

        const members = [], skipped = []
        for (const id of targets) {
            const target = participants.find(u => [u.id, u.lid, u.jid, u.phoneNumber].some(v => v && norm(v) === norm(id)))
            if (!target) skipped.push(`${id.split('@')[0]} (bukan anggota grup)`)
            else if (botJids.includes(norm(target.id)) || botJids.includes(norm(target.lid))) skipped.push('bot sendiri')
            else if (target.admin === 'superadmin' || norm(target.id) === owner) skipped.push(`${target.tag || '@' + target.id.split('@')[0]} (pembuat grup)`)
            else if (target.admin) skipped.push(`${target.tag || '@' + target.id.split('@')[0]} (sesama admin, gak bisa di-kick)`)
            else members.push(target)
        }

        if (!members.length) return RaplyGwe(`❌ Tidak ada yang bisa dikeluarkan:\n- ${skipped.join('\n- ')}`)

        const res = await conn.groupParticipantsUpdate(m.chat, members.map(p => p.id), 'remove')

        const ok = members.filter((p, i) => String(res?.[i]?.status || '200') === '200')
        const fail = members.filter(p => !ok.includes(p))

        let text = ok.length ? `👢 *KICK BERHASIL!*\n\n${ok.map(p => p.tag).join(', ')} berhasil dikeluarkan dari grup.` : '👢 *KICK GAGAL!*\n\nGagal mengeluarkan member.'
        if (fail.length) text += `\n\n❌ Gagal: ${fail.map(p => p.tag).join(', ')}`
        if (skipped.length) text += `\n\n⚠️ Dilewati:\n- ${skipped.join('\n- ')}`

        await conn.sendMessage(m.chat, {
            text,
            mentions: members.map(p => p.id)
        }, { quoted: m })

    } catch (e) {
        console.log('KICK ERROR:', e.message)
        return RaplyGwe(`❌ Gagal kick: ${e.message}`)
    }
}

handler.help = ['kick <@tag>']
handler.tags = ['group']
handler.command = /^(kick)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
