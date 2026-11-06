let handler = async (m, { conn, text, usedPrefix, command, participants, botJids, RaplyGwe }) => {
    const norm = (v) => String(v || '').replace(/:\d+@/, '@')

    const pesan = (text || m.quoted?.text || '').trim() || 'Perhatian semuanya!'

    const members = []
    for (const p of participants || []) {
        if (botJids.includes(norm(p.id)) || botJids.includes(norm(p.lid))) continue
        const jid = [p.phoneNumber, p.jid, p.id].find(v => typeof v === 'string' && v.endsWith('@s.whatsapp.net')) || p.id
        if (jid && !members.some(x => x === jid)) members.push(jid)
    }

    if (!members.length) return RaplyGwe(`Gagal mengambil daftar member grup, coba lagi.\n\nContoh: ${usedPrefix + command} Ayo kumpul!`)

    for (let i = 0; i < members.length; i += 100) {
        const part = members.slice(i, i + 100)
        const header = i === 0
            ? `⁉️*Tag All Member*\n\n` 
            : `Selengkapnya...\n\n`

        await conn.sendMessage(m.chat, {
            text: header + part.map(jid => `┃ @${jid.split('@')[0]}`).join('\n'),
            mentions: part
        }, { quoted: m })

        if (i + 100 < members.length) await new Promise(r => setTimeout(r, 1500))
    }
}

handler.help = ['tagall <pesan>']
handler.tags = ['group']
handler.command = /^(tagall|tegal|mentionall|tagsemua)$/i
handler.group = true
handler.admin = true

export default handler
