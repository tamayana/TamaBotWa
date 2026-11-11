// plugins/game/family100.js
let soal = [
    { soal: 'Buah yang sering dimakan?', jawab: ['mangga', 'apel', 'pisang', 'durian', 'anggur'] },
    { soal: 'Yang bikin orang galau?', jawab: ['mantan', 'jomblo', 'putus', 'duit', 'utang'] },
    { soal: 'Yang ada di kamar?', jawab: ['kasur', 'bantal', 'kipas', 'lemari', 'hp'] },
    { soal: 'Minuman yang sering dibeli?', jawab: ['kopi', 'teh', 'boba', 'susu', 'es'] },
    { soal: 'Yang bikin orang telat sekolah?', jawab: ['begadang', 'macet', 'ngantuk', 'mager', 'hujan'] },
]

let handler = async (m, { conn }) => {
    if (conn.family?.[m.chat]) return m.reply('Masih ada soal Family 100 yang jalan! Jawab dulu!')
    let pick = soal[Math.floor(Math.random() * soal.length)]
    await conn.sendMessage(m.chat, { text: `*👪 FAMILY 100!*\n\n*${pick.soal}*\n\nSebutkan 1 jawaban! Ada 5 jawaban! Siapa yang bisa jawab semua?` }, { quoted: m })
    conn.family = conn.family || {}
    conn.family[m.chat] = { ...pick, terjawab: [] }
    setTimeout(() => {
        if (conn.family?.[m.chat]) {
            let sisa = conn.family[m.chat].jawab.filter(x => !conn.family[m.chat].terjawab.includes(x))
            conn.sendMessage(m.chat, { text: `Waktu habis! Jawaban yang belum kejawab: *${sisa.join(', ').toUpperCase()}*` })
            delete conn.family[m.chat]
        }
    }, 60000)
}
handler.before = async (m, { conn }) => {
    if (!conn.family?.[m.chat] || m.fromMe) return
    let jawaban = m.text?.toLowerCase().trim()
    let data = conn.family[m.chat]
    if (data.jawab.includes(jawaban) && !data.terjawab.includes(jawaban)) {
        data.terjawab.push(jawaban)
        await conn.sendMessage(m.chat, { text: `*BENAR!* 🎉 @${m.sender.split('@')[0]} jawab *${jawaban.toUpperCase()}*! Udah kejawab ${data.terjawab.length}/5!` }, { quoted: m })
        if (data.terjawab.length >= 5) {
            await conn.sendMessage(m.chat, { text: `*FAMILY 100 TAMAT!* Semua jawaban kejawab! Kalian pinter!` })
            delete conn.family[m.chat]
        }
    }
}
handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100|family$/i
export default handler
