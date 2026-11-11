// plugins/game/kuismath.js
let handler = async (m, { conn }) => {
    if (conn.math?.[m.chat]) return m.reply('Masih ada soal math! Jawab dulu!')
    let a = Math.floor(Math.random() * 50) + 1
    let b = Math.floor(Math.random() * 20) + 1
    let ops = ['+', '-', 'x'][Math.floor(Math.random() * 3)]
    let jawab = ops === '+' ? a + b : ops === '-' ? a - b : a * b
    await conn.sendMessage(m.chat, { text: `*➗ KUIS MATH CEPAT!*\n\n*${a} ${ops} ${b} = ?*\n\nSiapa paling cepet? Waktu 30 detik!` }, { quoted: m })
    conn.math = conn.math || {}
    conn.math[m.chat] = jawab
    setTimeout(() => {
        if (conn.math?.[m.chat]) {
            conn.sendMessage(m.chat, { text: `Waktu habis! Jawabannya: *${jawab}*! Pada lemot!` })
            delete conn.math[m.chat]
        }
    }, 30000)
}
handler.before = async (m, { conn }) => {
    if (!conn.math?.[m.chat] || m.fromMe) return
    if (parseInt(m.text?.trim()) === conn.math[m.chat]) {
        await conn.sendMessage(m.chat, { text: `*BENAR!* 🎉 @${m.sender.split('@')[0]} paling cepet! Jawabannya *${conn.math[m.chat]}*! Pinter!` }, { quoted: m })
        delete conn.math[m.chat]
    }
}
handler.help = ['kuismath']
handler.tags = ['game']
handler.command = /^kuismath|math$/i
export default handler
