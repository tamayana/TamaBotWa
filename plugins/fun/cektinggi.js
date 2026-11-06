let handler = async (m, { conn }) => {
    let mentioned = (m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    let tinggi = Math.floor(Math.random() * 50) + 150

    let desc = tinggi >= 190 ? 'TINGGI BANGET! Model basketball! 🏀'
        : tinggi >= 175 ? 'Tinggi ideal! 😎'
        : tinggi >= 165 ? 'Lumayan tinggi 👍'
        : tinggi >= 155 ? 'Standard kok 🙂'
        : 'Imut dan mungil! 🥺'

    let tag = `@${mentioned.split('@')[0]}`
    let txt = mentioned === m.sender
        ? `Hai ${tag}\n\nTinggi badan kamu *${tinggi} cm*\n\`\`\`${desc}\`\`\``
        : `Kamu ingin ngecek tingkat ketinggian ${tag} yak?\n\nTinggi badan dia sebesar *${tinggi} cm*\n\`\`\`${desc}\`\`\``

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['cektinggi <@tag>']
handler.tags = ['fun']
handler.command = /^(cektinggi|tinggi)$/i

export default handler
