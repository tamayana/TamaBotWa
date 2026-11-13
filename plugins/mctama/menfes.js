// plugins/menfes.js - CUMA BUAT NGIRIM
let handler = async (m, { conn, text, usedPrefix }) => {
    if (!global.db.data.menfes) global.db.data.menfes = {}

    if (!text) return m.reply(`*BOT CONFESS TAMA* 💌\n\nCara pake:\n${usedPrefix}menfes nomor|pesan kamu\n\nContoh:\n${usedPrefix}menfes 62812xxxx|hai hacoy, aku suka kamu dari lama hehehe\n\nBuat berhenti: ketik *${usedPrefix}stopmenfes*`)

    let [no, ...pesanArr] = text.split('|')
    let pesan = pesanArr.join('|').trim()
    no = (no || '').replace(/[^0-9]/g, '')
    if (no.startsWith('0')) no = '62' + no.slice(1)

    if (!no || !pesan) return m.reply(`Format salah bung!\nContoh: ${usedPrefix}menfes 62812xxxx|hai aku suka kamu`)

    let targetJid = no + '@s.whatsapp.net'
    let senderJid = m.sender

    global.db.data.menfes[senderJid] = targetJid
    global.db.data.menfes[targetJid] = senderJid

    try {
        await conn.sendMessage(targetJid, {
            text: `💌 *ADA PESAN CONFESS BUAT KAMU!*\n\n"${pesan}"\n\n────────────────\nPengirimnya dirahasiakan! Dia malu katanya hehehe.\n\nMau bales? *Langsung bales aja chat ini!* Nanti gua sampein ke dia tanpa nyebut nama kamu juga!\n\nMau berhenti? Ketik *${usedPrefix}stopmenfes*`
        })
    } catch (e) {
        return m.reply(`Gagal kirim! Mungkin nomornya gak ada WA / dia block bot.`)
    }

    await m.reply(`Pesan Berhasil dikirim :)`)
    await conn.sendMessage(m.chat, { text: `Menunggu crush kamu membalas chat...` }, { quoted: m })
}

handler.help = ['menfes']
handler.tags = ['mctama']
handler.command = /^(menfes|confess|menfess)$/i
export default handler
