let handler = async (m, { conn }) => {
    const mentionedJid = m.mentionedJid || m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const mentioned = mentionedJid[0] || m.sender
    const percent = Math.floor(Math.random() * 101)
                        
    let desc = ''
    if (percent >= 90) {
        desc = 'PSIKOPAT AKUT! Jauhi! 😈'
    } else if (percent >= 70) {
        desc = 'Hati-hati sama orang ini 👀'
    } else if (percent >= 50) {
        desc = 'Ada sisi gelapnya 🌑'
    } else if (percent >= 30) {
        desc = 'Sedikit misterius 🤔'
    } else {
        desc = 'Normal dan baik hati 😇'
    }
    
    let txt = mentioned === m.sender 
        ? `Hai @${mentioned.split('@')[0]}\n\nTingkat kepsikopatan kamu *${percent}%*\n\`\`\`${desc}\`\`\`` 
        : `Kamu ingin ngecek tingkat kepsikopatan @${mentioned.split('@')[0]} yak?\n\nTingkat kepsikopatan dia sebesar *${percent}%*\n\`\`\`${desc}\`\`\``
    
    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.command = ['cekpsikopat', 'psikopat']
handler.tags = ['fun']
handler.help = ['cekpsikopat']

export default handler
