let handler = async (m, { conn }) => {
    let mentioned = (m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    // PENGAMAN BARU: Hasil konsisten per user per hari! Biar bisa di-ss!
    // Hari ini 90% ya 90% terus, besok baru ganti!
    let today = new Date().toISOString().slice(0, 10) // 2026-11-10
    let seedStr = mentioned + today
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
    }
    let percent = Math.abs(hash) % 101

    let desc = percent >= 90 ? 'GABUT LEVEL MAX! Main bot aja~ 🥱'
        : percent >= 70 ? 'Gabut parah nih! 😴'
        : percent >= 50 ? 'Lumayan gabut 😅'
        : percent >= 30 ? 'Agak sibuk dikit 📝'
        : 'Sibuk banget! Produktif! 💼'

    let tag = `@${mentioned.split('@')[0]}`
    let txt = mentioned === m.sender
        ? `Hai ${tag}\n\nTingkat kegabutan kamu *${percent}%*\n\`\`\`${desc}\`\`\`\n\n_Cek lagi besok, siapa tau udah tobat!_`
        : `Kamu ingin ngecek tingkat kegabutan ${tag} yak?\n\nTingkat kegabutan dia sebesar *${percent}%*\n\`\`\`${desc}\`\`\`\n\n_Tag dia biar tobat!_`

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['cekgabut <@tag>']
handler.tags = ['fun']
handler.command = /^(cekgabut|gabut)$/i

export default handler
