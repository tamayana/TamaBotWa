let handler = async (m, { conn, usedPrefix }) => {
    let name = m.pushName || 'Bestie'
    let runtime = process.uptime()
    let jam = Math.floor(runtime / 3600)
    let menit = Math.floor((runtime % 3600) / 60)
    let detik = Math.floor(runtime % 60)
    let runTime = `${jam} Jam ${menit} Menit ${detik} Detik`

    let text = `👋 𝖧𝖾𝗅𝗈, @${m.sender.split('@')[0]} !

╭───〔 𝗧𝗔𝗠𝗔 𝗕𝗢𝗧 〕───╮
│ ✦ 𝖢𝗋𝖾𝖺𝗍𝗈𝗋 : wa.me/6285393659857
│ ✦ 𝖵𝖾𝗋𝗌𝗂𝗈𝗇 : 𝟥.𝟢𝟢
│ ✦ 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${runTime}
│ ✦ 𝖯𝗋𝖾𝖿𝗂𝗑 : ${usedPrefix}
╰─────────────────╯

╭───〔 🤖 𝗔𝗜 〕───╮
│ • ${usedPrefix}bostama <pertanyaan>
│ • ${usedPrefix}claude <pertanyaan>
│ • ${usedPrefix}cloudflare <pertanyaan>
│ • ${usedPrefix}deepseek <pertanyaan>
│ • ${usedPrefix}feelbetter <pesan>
│ • ${usedPrefix}gemini <pertanyaan>
│ • ${usedPrefix}jokowi <pertanyaan>
│ • ${usedPrefix}nanobanana <prompt>
│ • ${usedPrefix}prabowo <pertanyaan>
│ • ${usedPrefix}promptgen <teks>
╰─────────────────╯

╭───〔 🐛 𝗕𝗨𝗚𝗦 〕───╮
│ • ${usedPrefix}blank <nomor>
│ • ${usedPrefix}delay <nomor>
╰─────────────────╯

╭───〔 📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 〕───╮
│ • ${usedPrefix}aio <link>
│ • ${usedPrefix}capcut <url>
│ • ${usedPrefix}mediafire <url>
│ • ${usedPrefix}npmdl <paket>
│ • ${usedPrefix}pindl <url>
│ • ${usedPrefix}tiktok <link>
╰─────────────────╯

╭───〔 🎉 𝗙𝗨𝗡 〕───╮
│ • ${usedPrefix}animehot
│ • ${usedPrefix}cekgabut <@tag>
│ • ${usedPrefix}cekpsikopat
│ • ${usedPrefix}ceksisaumur <@tag>
│ • ${usedPrefix}cektinggi <@tag>
│ • ${usedPrefix}pap
│ • ${usedPrefix}tobrut
╰─────────────────╯

╭───〔 🎮 𝗚𝗔𝗠𝗘 〕───╮
│ • ${usedPrefix}asahotak
│ • ${usedPrefix}daily
│ • ${usedPrefix}dompet
│ • ${usedPrefix}family100
│ • ${usedPrefix}kuismath
│ • ${usedPrefix}pesawat
│ • ${usedPrefix}slot
│ • ${usedPrefix}sonic
│ • ${usedPrefix}tebakangka
│ • ${usedPrefix}tebakata
│ • ${usedPrefix}transfer
╰─────────────────╯

╭───〔 👥 𝗚𝗥𝗢𝗨𝗣 〕───╮
│ • ${usedPrefix}add
│ • ${usedPrefix}adminonly <on/off>
│ • ${usedPrefix}antibot <on/off/kick>
│ • ${usedPrefix}antidelete <on/off>
│ • ${usedPrefix}antijudol <on/off/kick>
│ • ${usedPrefix}antilink <on/off>
│ • ${usedPrefix}antispam <on/off/kick>
│ • ${usedPrefix}antiswgc <on/off>
│ • ${usedPrefix}antitagsw <on/off>
│ • ${usedPrefix}antiunadmin <on/off>
│ • ${usedPrefix}antivirtex <on/off/kick>
│ • ${usedPrefix}close
│ • ${usedPrefix}del
│ • ${usedPrefix}demote <@tag>
│ • ${usedPrefix}detect <on/off>
│ • ${usedPrefix}idgc
│ • ${usedPrefix}kick <@tag>
│ • ${usedPrefix}linkgc
│ • ${usedPrefix}open
│ • ${usedPrefix}pinpesan <24j/7h/30h>
│ • ${usedPrefix}promote <@tag>
│ • ${usedPrefix}tagal <pesan>
│ • ${usedPrefix}unpin
│ • ${usedPrefix}welcome <on/off>
╰─────────────────╯

╭───〔 📣 𝗝𝗣𝗠 〕───╮
│ • ${usedPrefix}jpmch <teks>
│ • ${usedPrefix}stopjpmch
╰─────────────────╯

╭───〔 📌 𝗠𝗔𝗜𝗡 〕───╮
│ • ${usedPrefix}allmenu
│ • ${usedPrefix}donasi
│ • ${usedPrefix}donate
│ • ${usedPrefix}ping
│ • ${usedPrefix}sc
╰─────────────────╯

╭───〔 🎨 𝗠𝗔𝗞𝗘𝗥 〕───╮
│ • ${usedPrefix}brat <teks>
│ • ${usedPrefix}bratvid <teks>
│ • ${usedPrefix}bratvid2 <teks>
│ • ${usedPrefix}iqc <teks>
│ • ${usedPrefix}jadianime
│ • ${usedPrefix}jadihitam
│ • ${usedPrefix}photolive
│ • ${usedPrefix}sticker
│ • ${usedPrefix}toimg
│ • ${usedPrefix}tomp3
│ • ${usedPrefix}tovn
╰─────────────────╯

╭───〔 ✨ 𝗠𝗖𝗧𝗔𝗠𝗔 〕───╮
│ • ${usedPrefix}absen
│ • ${usedPrefix}afk
│ • ${usedPrefix}jodoh
│ • ${usedPrefix}khodam
│ • ${usedPrefix}reminder
╰─────────────────╯

╭───〔 👑 𝗢𝗪𝗡𝗘𝗥 〕───╮
│ • ${usedPrefix}addowner <nomor>
│ • ${usedPrefix}addplugin <nama>
│ • ${usedPrefix}addprem <nomor>
│ • ${usedPrefix}backup
│ • ${usedPrefix}blacklist <nomor>
│ • ${usedPrefix}delplugin <nama>
│ • ${usedPrefix}getplugin <nama>
│ • ${usedPrefix}listplugin
│ • ${usedPrefix}public
│ • ${usedPrefix}self
│ • ${usedPrefix}swgc <teks>
╰─────────────────╯

╭───〔 🔍 𝗦𝗘𝗔𝗥𝗖𝗛 〕───╮
│ • ${usedPrefix}kodepos <kota>
│ • ${usedPrefix}play <judul>
╰─────────────────╯

╭───〔 🏪 𝗦𝗧𝗢𝗥𝗘 〕───╮
│ • ${usedPrefix}done <username>, <item>, <nominal>
│ • ${usedPrefix}payment
│ • ${usedPrefix}proses <username>, <item>, <nominal>
╰─────────────────╯

╭───〔 🛠️ 𝗧𝗢𝗢𝗟𝗦 〕───╮
│ • ${usedPrefix}cekgempa
│ • ${usedPrefix}cekidch <link>
│ • ${usedPrefix}cekmail <email>
│ • ${usedPrefix}get <url>
│ • ${usedPrefix}kalkulator <soal>
│ • ${usedPrefix}pesanmail <id>
│ • ${usedPrefix}rch <link_channel> <emoji>
│ • ${usedPrefix}rvo
│ • ${usedPrefix}ssweb <link>
│ • ${usedPrefix}tempmail
│ • ${usedPrefix}tobotak
│ • ${usedPrefix}tourl
╰─────────────────╯

> _Ketik ${usedPrefix}allmenu buat liat semua!_`

    await conn.sendMessage(m.chat, { text, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['allmenu', 'menu']
handler.tags = ['main']
handler.command = /^(allmenu|menu)$/i
export default handler
