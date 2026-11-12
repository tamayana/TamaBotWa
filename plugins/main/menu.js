let handler = async (m, { conn, usedPrefix }) => {
    let name = m.pushName || 'Bestie'
    let uptime = process.uptime()
    let jam = Math.floor(uptime / 3600)
    let menit = Math.floor((uptime % 3600) / 60)
    let detik = Math.floor(uptime % 60)

    let text = `👋 𝖧𝖾𝗅𝗈, @${m.sender.split('@')[0]} !

╭───〔 𝗧𝗔𝗠𝗔 𝗕𝗢𝗧 〕───╮
│ ✦ 𝖢𝗋𝖾𝖺𝗍𝗈𝗋 : wa.me/6285393659857
│ ✦ 𝖵𝖾𝗋𝗌𝗂𝗈𝗇 : 𝟥.𝟢𝟢
│ ✦ 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${jam} Jam ${menit} Menit ${detik} Detik
╰─────────────────╯

Ini daftar fitur nya, tinggal ketik aja di chat, gak usah di klik!

╭───〔 🤖 𝗔𝗜 〕───╮
│ • .gemini <tanya>
│ • .claude <tanya>
│ • .deepseek <tanya>
│ • .bostama <tanya>
╰─────────────────╯

╭───〔 🎮 𝗚𝗔𝗠𝗘 〕───╮
│ • .slot
│ • .pesawat
│ • .sonic
╰─────────────────╯

╭───〔 👥 𝗚𝗥𝗢𝗨𝗣 〕───╮
│ • .kick <@tag>
│ • .add <nomor>
│ • .promote <@tag>
│ • .tagal <pesan>
╰─────────────────╯

╭───〔 🛠️ 𝗧𝗢𝗢𝗟𝗦 〕───╮
│ • .sticker
│ • .toimg
│ • .tourl
│ • .ssweb <link>
│ • .cekgempa
╰─────────────────╯

╭───〔 📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 〕───╮
│ • .tiktok <link>
│ • .play <judul>
│ • .capcut <url>
╰─────────────────╯

> _Mau liat semua? Ketik .allmenu_
> _Mau cek bot hidup? Ketik .ping_`

    await conn.sendMessage(m.chat, { text, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu)$/i
export default handler
