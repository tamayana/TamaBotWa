let handler = async (m, { conn }) => {
    let mentioned = (m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    let percent = Math.floor(Math.random() * 101)

    let desc = percent >= 90 ? 'GABUT LEVEL MAX! Main bot aja~ 🥱'
        : percent >= 70 ? 'Gabut parah nih! 😴'
        : percent >= 50 ? 'Lumayan gabut 😅'
        : percent >= 30 ? 'Agak sibuk dikit 📝'
        : 'Sibuk banget! Produktif! 💼'

    let tag = `@${mentioned.split('@')[0]}`
    let txt = mentioned === m.sender
        ? `Hai ${tag}\n\nTingkat kegabutan kamu *${percent}%*\n\`\`\`${desc}\`\`\``
        : `Kamu ingin ngecek tingkat kegabutan ${tag} yak?\n\nTingkat kegabutan dia sebesar *${percent}%*\n\`\`\`${desc}\`\`\``

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['cekgabut <@tag>']
handler.tags = ['fun']
handler.command = /^(cekgabut|gabut)$/i

export default handler
