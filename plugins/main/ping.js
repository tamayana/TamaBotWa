let handler = async (m, { conn, usedPrefix }) => {
    let start = Date.now()
    // Kirim pesan dulu buat ngukur kecepatan
    let msg = await conn.sendMessage(m.chat, { text: '🏓 PING...' }, { quoted: m })
    let speed = Date.now() - start

    let uptime = process.uptime()
    let jam = Math.floor(uptime / 3600)
    let menit = Math.floor((uptime % 3600) / 60)
    let detik = Math.floor(uptime % 60)

    let text = `🏓 *PONG!*

• *Kecepatan:* ${speed} ms
• *Status:* Online ✅
• *Uptime:* ${jam} Jam ${menit} Menit ${detik} Detik
• *Bot:* TamaBotWa v3.00

> _Bot masih hidup bestie, gas pake!_`

    // Edit pesan yang tadi, jadi gak spam 2 pesan, langsung keliatan!
    await conn.sendMessage(m.chat, { text, edit: msg.key })
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = /^(ping)$/i
export default handler
