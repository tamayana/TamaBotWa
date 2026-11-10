let handler = async (m, { conn }) => {
    let mentioned = (m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    // SAMA KAYAK cekgabut & cekpsikopat: Konsisten per user per hari!
    let today = new Date().toISOString().slice(0, 10)
    let seedStr = mentioned + today + 'sisaumur'
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
    }
    let absHash = Math.abs(hash)

    let tahun = (absHash % 80) + 20
    let bulan = Math.floor(absHash / 100) % 12
    let hari = Math.floor(absHash / 1000) % 30

    let desc = tahun > 80 ? 'Panjang umur banget! 🎉'
        : tahun > 60 ? 'Lumayan panjang~ ✨'
        : tahun > 40 ? 'Cukup lah ya 😊'
        : 'Jaga kesehatan ya! 🙏'

    let tag = `@${mentioned.split('@')[0]}`
    let txt = mentioned === m.sender
        ? `Hai ${tag}\n\nSisa umur kamu *${tahun} Tahun ${bulan} Bulan ${hari} Hari*\n\`\`\`${desc}\`\`\`\n\n_Cuma buat lucu-lucuan ya, jangan baper! 😂_`
        : `Kamu ingin ngecek sisa umur ${tag} yak?\n\nSisa umur dia sebesar *${tahun} Tahun ${bulan} Bulan ${hari} Hari*\n\`\`\`${desc}\`\`\`\n\n_Cuma buat lucu-lucuan ya, jangan baper! 😂_`

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['ceksisaumur <@tag>']
handler.tags = ['fun']
handler.command = /^(ceksisaumur|sisaumur)$/i

export default handler
