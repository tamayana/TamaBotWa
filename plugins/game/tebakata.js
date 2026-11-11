// plugins/game/tebakata.js
let soal = [
    { soal: 'A - Y - A - M', jawab: 'ayam' },
    { soal: 'K - U - C - I - N - G', jawab: 'kucing' },
    { soal: 'P - O - N - T - I - A - N - A - K', jawab: 'pontianak' },
    { soal: 'M - A - N - G - G - A', jawab: 'mangga' },
    { soal: 'S - E - K - O - L - A - H', jawab: 'sekolah' },
    { soal: 'H - P', jawab: 'hp' },
    { soal: 'B - O - T', jawab: 'bot' },
    { soal: 'J - O - M - B - L - O', jawab: 'jomblo' },
    { soal: 'M - A - K - A - N', jawab: 'makan' },
    { soal: 'T - I - K - T - O - K', jawab: 'tiktok' },
    { soal: 'G - A - M - E', jawab: 'game' },
    { soal: 'B - U - D - I', jawab: 'budi' },
    { soal: 'C - I - N - T - A', jawab: 'cinta' },
    { soal: 'D - U - I - T', jawab: 'duit' },
    { soal: 'K - O - P - I', jawab: 'kopi' },
]

let handler = async (m, { conn }) => {
    if (conn.tebakata?.[m.chat]) return m.reply('Masih ada soal yang belum dijawab woy! Jawab dulu!')
    let pick = soal[Math.floor(Math.random() * soal.length)]
    await conn.sendMessage(m.chat, { text: `*🎮 TEBAK KATA!*\n\nSusun kata ini:\n\n*${pick.soal}*\n\nWaktu 60 detik! Ketik aja jawabannya!` }, { quoted: m })
    conn.tebakata = conn.tebakata || {}
    conn.tebakata[m.chat] = pick
    setTimeout(() => {
        if (conn.tebakata?.[m.chat]) {
            conn.sendMessage(m.chat, { text: `Waktu habis! Jawabannya: *${pick.jawab.toUpperCase()}*! Pada bego semua!` })
            delete conn.tebakata[m.chat]
        }
    }, 60000)
}
handler.before = async (m, { conn }) => {
    if (!conn.tebakata?.[m.chat] || m.fromMe) return
    if (m.isBaileys) return
    let jawaban = m.text?.toLowerCase().trim()
    if (!jawaban) return
    if (jawaban === conn.tebakata[m.chat].jawab) {
        await conn.sendMessage(m.chat, { text: `*BENAR!* 🎉 @${m.sender.split('@')[0]} jawabnya bener! Jawabannya *${conn.tebakata[m.chat].jawab.toUpperCase()}*! Gacor!` }, { quoted: m })
        delete conn.tebakata[m.chat]
    }
}
handler.help = ['tebakata']
handler.tags = ['game']
handler.command = /^tebakata|susunkata$/i
export default handler
