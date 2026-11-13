// plugins/menfes.js - BOT CONFESS / MENFES ALA TAMA
let handler = async (m, { conn, text, usedPrefix }) => {
    if (!global.db.data.menfes) global.db.data.menfes = {}

    // KALO GAK ADA TEKS, KASIH CARA PAKE
    if (!text) return m.reply(`*BOT CONFESS TAMA* 💌\n\nCara pake:\n${usedPrefix}menfes nomor|pesan kamu\n\nContoh:\n${usedPrefix}menfes 62812xxxx|hai hacoy, aku suka kamu dari lama hehehe\n\nNanti bot kirim pesan kamu ke dia TANPA nyebut nama kamu! Dia bisa bales, dan balesannya bakal gua terusin ke kamu! Jadi bisa chattingan tanpa ketahuan!\n\nBuat berhenti: ketik *${usedPrefix}stopmenfes*`)

    // FORMAT: nomor|pesan
    let [no, ...pesanArr] = text.split('|')
    let pesan = pesanArr.join('|').trim()
    no = (no || '').replace(/[^0-9]/g, '')
    if (no.startsWith('0')) no = '62' + no.slice(1)

    if (!no || !pesan) return m.reply(`Format salah bung!\nContoh: ${usedPrefix}menfes 62812xxxx|hai aku suka kamu`)
    if (no === m.sender.split('@')[0]) return m.reply('Masa confess ke diri sendiri jing 😭')

    let targetJid = no + '@s.whatsapp.net'
    let senderJid = m.sender

    // SIMPEN PASANGAN BIAR BISA SALING BALES
    global.db.data.menfes[senderJid] = targetJid
    global.db.data.menfes[targetJid] = senderJid

    // 1. KIRIM KE CRUSH NYA!
    try {
        await conn.sendMessage(targetJid, {
            text: `💌 *ADA PESAN CONFESS BUAT KAMU!*\n\n"${pesan}"\n\n────────────────\nPengirimnya dirahasiakan! Dia malu katanya hehehe.\n\nMau bales? *Langsung bales aja chat ini!* Nanti gua sampein ke dia tanpa nyebut nama kamu juga!\n\nMau berhenti? Ketik *${usedPrefix}stopmenfes*`
        })
    } catch (e) {
        return m.reply(`Gagal kirim! Mungkin nomornya gak ada WA / dia block bot. Coba cek nomornya lagi!`)
    }

    // 2. BALES KE PENGIRIM
    await m.reply(`Pesan Berhasil dikirim :)`)
    await conn.sendMessage(m.chat, { text: `Menunggu crush kamu membalas chat...` }, { quoted: m })
}

handler.help = ['menfes']
handler.tags = ['mctama']
handler.command = /^(menfes|confess|menfess)$/i

// INI YANG BIKIN BISA SALING BALES TANPA KETAHUAN!
handler.before = async (m, { conn, usedPrefix }) => {
    if (!global.db.data.menfes) global.db.data.menfes = {}
    if (m.isGroup) return
    if (!m.text) return

    // KALO LAGI NGETIK COMMAND, JANGAN DI FORWARD
    if (m.text.startsWith(usedPrefix)) return

    let pasangan = global.db.data.menfes[m.sender]
    if (!pasangan) return

    // KALO YANG NGIRIM ITU PENGIRIM PERTAMA, BILANGNYA "PENGAGUM RAHASIAMU"
    // KALO YANG NGIRIM ITU TARGET, BILANGNYA JUGA ANONIM BIAR ADIL
    // KITA CEK: SIAPA YANG MULAI DULU? SIMPELNYA KITA BILANG AJA "PENGAGUM RAHASIAMU" / "DIA"
    // BIAR GAK BINGUNG, KITA KASIH LABEL SESUAI ARAH
    let isPengirimAwal = false
    // Cara simpel: kita gak tau siapa awal, jadi kita pake label netral
    // Tapi biar kaya screenshot, kita pake "Pengagum rahasiamu" buat yang nerima pertama kali

    // KIRIM KE PASANGAN
    try {
        await conn.sendMessage(pasangan, {
            text: `💬 *Pengagum rahasiamu:*\n${m.text}\n\n────────────────\n_Bales aja chat ini buat bales dia! Ketik ${usedPrefix}stopmenfes buat berhenti_`,
            // FORWARD JUGA KALO DIA KIRIM GAMBAR / STIKER? BUAT SIMPEL, KITA HANDLE TEKS DULU
        })
        // KASIH TANDA KE PENGIRIM KALO UDAH KE KIRIM
        // Gak usah bales apa-apa biar gak spam, cukup diem
    } catch (e) {
        // KALO GAGAL, HAPUS PASANGAN
        delete global.db.data.menfes[m.sender]
    }
}

export default handler
