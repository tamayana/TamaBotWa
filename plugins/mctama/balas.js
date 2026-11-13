// plugins/balas.js - BUAT BALES MENFES! INI YANG BENER!
let handler = async (m, { conn, text, usedPrefix }) => {
    if (!global.db.data.menfes) global.db.data.menfes = {}
    let pasangan = global.db.data.menfes[m.sender]

    if (!pasangan) return m.reply('Kamu lagi gak menfes sama siapa-siapa! Kirim dulu pake .menfes nomor|pesan')
    if (!text) return m.reply(`Mau bales apa?\nContoh: ${usedPrefix}balas hai juga, kamu siapa?`)

    // KIRIM KE PASANGAN
    try {
        await conn.sendMessage(pasangan, {
            text: `💬 *Pengagum rahasiamu:*\n${text}\n\n────────────────\n_Mau bales dia? Ketik *.balas* + pesan kamu!_`
        })
        await m.reply(`✅ Udah gua kirim ke dia!`)
    } catch (e) {
        m.reply('Gagal kirim! Dia mungkin block bot.')
    }
}
handler.help = ['balas']
handler.tags = ['mctama']
handler.command = /^(balas|reply)$/i
export default handler
