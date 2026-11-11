let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply(`Cara pakai:\n*${usedPrefix}confess gua suka sama si A*`)
    await conn.sendMessage(m.chat, { text: `*💌 CONFESS ANONIM!*\n\n"${text}"\n\n_Dari: Seseorang yang rahasia 🤫_` })
    await m.reply('Confess lu udah terkirim! Anonim! Aman!')
}
handler.help = ['confess', 'menfess']
handler.tags = ['mctama']
handler.command = /^(confess|menfess|confes)$/i
export default handler
