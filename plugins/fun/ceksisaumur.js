let handler = async (m, { conn }) => {
    let mentioned = (m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    let tahun = Math.floor(Math.random() * 80) + 20
    let bulan = Math.floor(Math.random() * 12)
    let hari = Math.floor(Math.random() * 30)

    let desc = tahun > 80 ? 'Panjang umur banget! 🎉'
        : tahun > 60 ? 'Lumayan panjang~ ✨'
        : tahun > 40 ? 'Cukup lah ya 😊'
        : 'Jaga kesehatan ya! 🙏'

    let tag = `@${mentioned.split('@')[0]}`
    let txt = mentioned === m.sender
        ? `Hai ${tag}\n\nSisa umur kamu *${tahun} Tahun ${bulan} Bulan ${hari} Hari*\n\`\`\`${desc}\`\`\``
        : `Kamu ingin ngecek tingkat kesisaumuran ${tag} yak?\n\nSisa umur dia sebesar *${tahun} Tahun ${bulan} Bulan ${hari} Hari*\n\`\`\`${desc}\`\`\``

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['ceksisaumur <@tag>']
handler.tags = ['fun']
handler.command = /^(ceksisaumur|sisaumur)$/i

export default handler
