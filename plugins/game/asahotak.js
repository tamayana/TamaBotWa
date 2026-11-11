// plugins/game/asahotak.js
let soal = [
    { soal: 'Aku hewan, aku bisa terbang, aku tidur siang, aku suka tikus. Siapakah aku?', jawab: 'burung hantu' },
    { soal: 'Aku buah, kulit ku duri, bau ku menyengat, tapi rasa ku enak. Aku?', jawab: 'durian' },
    { soal: 'Aku ada di HP, aku bikin orang ketawa, aku isinya joget-joget. Aku?', jawab: 'tiktok' },
    { soal: 'Aku jomblo, aku rebahan, aku scroll HP sampe pagi. Aku?', jawab: 'lu' },
    { soal: 'Aku benda, aku bisa foto, aku bisa chat, aku bikin orang mager. Aku?', jawab: 'hp' },
    { soal: 'Aku tempat, aku ada kasur, aku ada kipas, aku tempat lu rebahan. Aku?', jawab: 'kamar' },
    { soal: 'Aku minuman, aku pahit, aku bikin melek, anak tongkrongan suka aku. Aku?', jawab: 'kopi' },
    { soal: 'Aku hewan, aku mengeong, aku suka ikan. Aku?', jawab: 'kucing' },
]

let handler = async (m, { conn }) => {
    if (conn.asah?.[m.chat]) return m.reply('Masih ada soal! Jawab dulu!')
    let pick = soal[Math.floor(Math.random() * soal.length)]
    await conn.sendMessage(m.chat, { text: `*🧠 ASAH OTAK!*\n\n${pick.soal}\n\nWaktu 60 detik!` }, { quoted: m })
    conn.asah = conn.asah || {}
    conn.asah[m.chat] = pick
    setTimeout(() => {
        if (conn.asah?.[m.chat]) {
            conn.sendMessage(m.chat, { text: `Waktu habis! Jawabannya: *${pick.jawab.toUpperCase()}*!` })
            delete conn.asah[m.chat]
        }
    }, 60000)
}
handler.before = async (m, { conn }) => {
    if (!conn.asah?.[m.chat] || m.fromMe) return
    if (m.text?.toLowerCase().trim() === conn.asah[m.chat].jawab) {
        await conn.sendMessage(m.chat, { text: `*BENAR!* 🎉 @${m.sender.split('@')[0]} pinter! Jawabannya *${conn.asah[m.chat].jawab.toUpperCase()}*!` }, { quoted: m })
        delete conn.asah[m.chat]
    }
}
handler.help = ['asahotak']
handler.tags = ['game']
handler.command = /^asahotak|siapakahaku$/i
export default handler
