let handler = async (m, { conn, text, usedPrefix, command, participants, botJids, RaplyGwe, isAdmin, isOwner }) => {
    const norm = (v) => String(v || '').replace(/:\d+@/, '@')

    // CUMA ADMIN + OWNER YANG BISA!
    if (!isAdmin && !isOwner) {
        return RaplyGwe(`❌ *Cuma Admin grup* yang bisa pake fitur ini, lu siapa? 😏`)
    }

    // Teks bebas semau lu!
    const pesan = (text || m.quoted?.text || '').trim() || 'Perhatian semuanya!'

    try {
        const members = []
        for (const p of participants || []) {
            if (botJids.includes(norm(p.id)) || botJids.includes(norm(p.lid))) continue
            const jid = [p.phoneNumber, p.jid, p.id].find(v => typeof v === 'string' && v.endsWith('@s.whatsapp.net')) || p.id
            if (jid && !members.some(x => x === jid)) members.push(jid)
        }

        if (!members.length) return RaplyGwe(`❌ Gagal mengambil daftar member grup, coba lagi.\n\n*Contoh:* ${usedPrefix + command} Ayo kumpul!`)

        for (let i = 0; i < members.length; i += 100) {
            const part = members.slice(i, i + 100)
            const isFirst = i === 0

            const header = isFirst
                ? `📢 *TAG ALL MEMBER*\n`
                + `Total: *${members.length} member*\n\n`
                + `*Pesan:* ${pesan}\n\n`
                + `────────────────\n`
                : `*Lanjutan...*\n\n`

            await conn.sendMessage(m.chat, {
                text: header + part.map(jid => `┃ @${jid.split('@')[0]}`).join('\n'),
                mentions: part
            }, { quoted: m })

            if (i + 100 < members.length) await new Promise(r => setTimeout(r, 1500))
        }
    } catch (e) {
        console.log('TAGAL ERROR:', e.message)
        return RaplyGwe(`❌ Gagal tag all: ${e.message}`)
    }
}

handler.help = ['tagal <pesan>']
handler.tags = ['group']
// INI KUNCI NYA BUNG! GUA TARO "tagal" PALING DEPAN!
handler.command = /^(tagal|tagall|tegal|mentionall|tagsemua)$/i
handler.group = true
handler.admin = true

export default handler
