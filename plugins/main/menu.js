let handler = async (m, { conn, usedPrefix }) => {
    let name = m.pushName || 'Bestie'
    let runtime = process.uptime()
    let jam = Math.floor(runtime / 3600)
    let menit = Math.floor((runtime % 3600) / 60)
    let detik = Math.floor(runtime % 60)

    let text = `👋 𝖧𝖾𝗅𝗈, @${m.sender.split('@')[0]} !

╭───〔 𝗧𝗔𝗠𝗔 𝗕𝗢𝗧 〕───╮
│ ✦ 𝖢𝗋𝖾𝖺𝗍𝗈𝗋 : wa.me/6285393659857
│ ✦ 𝖵𝖾𝗋𝗌𝗂𝗈𝗇 : 𝟥.𝟢𝟢
│ ✦ 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${jam} Jam ${menit} Menit ${detik} Detik
╰─────────────────╯

╭───〔 📋 𝗠𝗘𝗡𝗨 〕───╮
│ • ${usedPrefix}allmenu - Semua Fitur
│ • ${usedPrefix}menu - Menu Ini
│ • ${usedPrefix}ping - Cek Bot
│ • ${usedPrefix}donasi - Donasi
│ • ${usedPrefix}sc - Script Bot
╰─────────────────╯

╭───〔 🤖 𝗔𝗜 〕───╮
│ Ketik ${usedPrefix}allmenu buat liat AI
│ Ada Gemini, Claude, DeepSeek, dll
╰─────────────────╯

╭───〔 🎮 𝗚𝗔𝗠𝗘 〕───╮
│ Ketik ${usedPrefix}allmenu buat liat Game
│ Ada Slot, Tebak Kata, Family100, dll
╰─────────────────╯

╭───〔 👥 𝗚𝗥𝗢𝗨𝗣 〕───╮
│ Ketik ${usedPrefix}allmenu buat liat Group
│ Ada Kick, Add, Antilink, dll
╰─────────────────╯

╭───〔 🛠️ 𝗧𝗢𝗢𝗟𝗦 〕───╮
│ Ketik ${usedPrefix}allmenu buat liat Tools
│ Ada SSWeb, ToURL, CekGempa, dll
╰─────────────────╯

> _Ketik ${usedPrefix}allmenu buat liat semua command lengkap!_`

    await conn.sendMessage(m.chat, { text, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu)$/i
export default handler
