// plugins/game/tebakangka.js
let handler = async (m, { conn }) => {
    if (conn.angka?.[m.chat]) return m.reply('Masih ada game tebak angka! Jawab dulu!')
    let angka = Math.floor(Math.random() * 100) + 1
    await conn.sendMessage(m.chat, { text: `*🔢 TEBAK ANGKA!*\n\nGua udah mikir angka 1-100! Tebak! Ketik aja angkanya!\n\nClue: Kalo jawaban lu kegedean / kekecilan, gua kasih tau!` }, { quoted: m })
    conn.angka = conn.angka || {}
    conn.angka[m.chat] = angka
}
handler.before = async (m, { conn }) => {
    if (!conn.angka?.[m.chat] || m.fromMe) return
    let tebak = parseInt(m.text?.trim())
    if (isNaN(tebak)) return
    let asli = conn.angka[m.chat]
    if (tebak === asli) {
        await conn.sendMessage(m.chat, { text: `*BENAR!* 🎉 @${m.sender.split('@')[0]} nebak *${asli}*! Hoki banget lu!` }, { quoted: m })
        delete conn.angka[m.chat]
    } else if (tebak > asli) {
        await conn.sendMessage(m.chat, { text: `Kegedean woy! Turunin dikit!` }, { quoted: m })
    } else {
        await conn.sendMessage(m.chat, { text: `Kekecilan woy! Naikin dikit!` }, { quoted: m })
    }
}
handler.help = ['tebakangka']
handler.tags = ['game']
handler.command = /^tebakangka$/i
export default handler
