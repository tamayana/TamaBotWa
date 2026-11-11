let handler = async (m, { conn }) => {
    global.absen = global.absen || {}
    global.absen[m.chat] = global.absen[m.chat] || []
    let list = global.absen[m.chat]
    if (list.includes(m.sender)) return m.reply('Lu udah absen woy! Jangan absen 2x! Sok rajin!')
    list.push(m.sender)
    await conn.sendMessage(m.chat, { text: `*✅ ABSEN BERHASIL!*\n\n@${m.sender.split('@')[0]} udah absen!\n\nTotal yang udah absen: *${list.length} orang*!\n\nYang belum absen, cepet absen! Ketik *.absen*` }, { quoted: m })
}
handler.help = ['absen', 'cekabsen']
handler.tags = ['group']
handler.command = /^absen$/i
export default handler
