let handler = async (m, { conn }) => {
    let mentioned = (m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    // SAMA KAYAK SEBELUM NYA: Konsisten per user per hari!
    let today = new Date().toISOString().slice(0, 10)
    let seedStr = mentioned + today + 'tinggi'
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
    }
    let tinggi = (Math.abs(hash) % 50) + 150

    let desc = tinggi >= 190 ? 'TINGGI BANGET! Model basketball! 🏀'
        : tinggi >= 175 ? 'Tinggi ideal! 😎'
        : tinggi >= 165 ? 'Lumayan tinggi 👍'
        : tinggi >= 155 ? 'Standard kok 🙂'
        : 'Imut dan mungil! 🥺'

    let tag = `@${mentioned.split('@')[0]}`
    let txt = mentioned === m.sender
        ? `Hai ${tag}\n\nTinggi badan kamu *${tinggi} cm*\n\`\`\`${desc}\`\`\`\n\n_Cuma buat lucu-lucuan ya, jangan baper! 😂_`
        : `Kamu ingin ngecek tinggi badan ${tag} yak?\n\nTinggi badan dia sebesar *${tinggi} cm*\n\`\`\`${desc}\`\`\`\n\n_Cuma buat lucu-lucuan ya, jangan baper! 😂_`

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['cektinggi <@tag>']
handler.tags = ['fun']
handler.command = /^(cektinggi|tinggi)$/i

export default handler
