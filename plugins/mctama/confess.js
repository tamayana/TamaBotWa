let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Cara pakai:\n*${usedPrefix}confess gua suka sama si A*\n\nBot bakal kirim anonim ke grup ini!`)
    await conn.sendMessage(m.chat, { text: `*💌 CONFESS ANONIM!*\n\n"${text}"\n\n_Dari: Seseorang yang rahasia 🤫_\n\nMau confess juga? Ketik *.confess isi pesan lu*` })
    await m.reply('Confess lu udah terkirim! Anonim! Aman!')
}
handler.help = ['confess', 'menfess']
handler.tags = ['fun']
handler.command = /^(confess|menfess|confes)$/i
export default handler
