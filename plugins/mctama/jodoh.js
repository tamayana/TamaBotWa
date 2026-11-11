let handler = async (m, { conn }) => {
    let target = m.mentionedJid?.[0] || m.sender
    let target2 = m.mentionedJid?.[1]
    if (!target2) {
        let persen = Math.floor(Math.random() * 101)
        let komen = persen > 80 ? 'COCOK BANGET! Gas nikah!' : persen > 50 ? 'Lumayan cocok! Gas PDKT!' : persen > 20 ? 'Kurang cocok! Cari yang lain!' : 'GAK COCOK! Mending jomblo aja!'
        return conn.sendMessage(m.chat, { text: `*💘 CEK JODOH!*\n\n@${target.split('@')[0]} jodoh lu:\n\nKecocokan: *${persen}%*\n${komen}` }, { quoted: m })
    }
    let persen = Math.floor(Math.random() * 101)
    let komen = persen > 80 ? 'COCOK BANGET! Gas nikah!' : persen > 50 ? 'Lumayan cocok!' : 'GAK COCOK! Mending pisah!'
    await conn.sendMessage(m.chat, { text: `*💘 CEK JODOH!*\n\n@${target.split('@')[0]} ❤️ @${target2.split('@')[0]}\n\nKecocokan: *${persen}%*\n${komen}` }, { quoted: m })
}
handler.help = ['jodoh']
handler.tags = ['mctama']
handler.command = /^jodoh|cekejodoh$/i
export default handler
