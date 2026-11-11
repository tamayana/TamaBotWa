let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Cara pakai:\n*.reminder 10m belajar*\n*.reminder 1j makan*')
    let [waktu, ...pesan] = text.split(' ')
    let pesanFull = pesan.join(' ')
    if (!pesanFull) return m.reply('Mau diingetin apa?')
    let detik = 0
    if (waktu.endsWith('m')) detik = parseInt(waktu) * 60 * 1000
    else if (waktu.endsWith('j')) detik = parseInt(waktu) * 60 * 60 * 1000
    else if (waktu.endsWith('d')) detik = parseInt(waktu) * 1000
    else return m.reply('Format waktu salah! Pakai m / j! Contoh: *.reminder 10m belajar*')
    await m.reply(`*REMINDER AKTIF!* ⏰\n\nGua bakal ingetin lu *${waktu}* lagi buat: *${pesanFull}*`)
    setTimeout(() => {
        conn.sendMessage(m.chat, { text: `*⏰ REMINDER!*\n\n@${m.sender.split('@')[0]} woy! Udah waktunya: *${pesanFull}*!` })
    }, detik)
}
handler.help = ['reminder']
handler.tags = ['mctama']
handler.command = /^reminder|ingetin$/i
export default handler
