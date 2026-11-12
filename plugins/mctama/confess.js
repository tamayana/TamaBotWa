// SIMPEN SEMENTARA: SIAPA TADI MINTA CONFESS DARI GRUP MANA
if (!global.confessPending) global.confessPending = {}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // ===== 1. KALO DI GRUP =====
    if (m.isGroup) {
        // Kalo cuma .confess doang / .confess isi, pokoknya dia mulai dari grup
        // HAPUS PESAN NYA BIAR GAK KETAUAN!
        if (!global.confessDelete) global.confessDelete = new Set()
        global.confessDelete.add(m.key.id)
        try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

        // INGET! SIAPA (m.sender) TADI DARI GRUP MANA (m.chat)
        global.confessPending[m.sender] = {
            groupId: m.chat,
            groupName: m.pushName || 'grup tadi', // nanti kita ambil nama grupnya
            time: Date.now()
        }
        // Ambil nama grup beneran
        try {
            let metadata = await conn.groupMetadata(m.chat).catch(() => null)
            if (metadata) global.confessPending[m.sender].groupName = metadata.subject
        } catch {}

        // LALU BOT JAPRI DIA!
        let grupName = global.confessPending[m.sender].groupName
        await conn.sendMessage(m.sender, { 
            text: `Hai! Lu tadi mau confess di grup *${grupName}* ya?\n\nKetik aja confess lu disini! Gak usah ketik nama grup lagi, gua udah tau lu mau kirim ke grup mana!\n\nContoh: ketik aja *aku suka sama kamu*\n\nKalo lu ketik di sini, langsung gua kirim ke grup *${grupName}* secara anonim!` 
        }).catch(() => {})
        return
    }

    // ===== 2. KALO DI JAPRI =====
    // Kalo dia japri tapi gak pernah mulai dari grup, suruh mulai dari grup dulu!
    if (!global.confessPending[m.sender]) {
        return m.reply(`Lu mau confess ke grup mana?\n\nCaranya gak usah japri dulu! Balik ke grup lu, ketik di grup:\n*.confess*\n\nNanti gua yang japri lu! Gua udah tau lu mau kirim ke grup mana, jadi lu gak usah ketik nama grup!`)
    }

    // Kalo dia udah pernah mulai dari grup, berarti isi chat japri ini = ISI CONFESS NYA!
    // Dia gak usah ketik .confess lagi, langsung ketik isi nya aja!
    // Tapi kalo dia ketik .confess isi juga tetep bisa!
    let isi = text.trim()
    if (isi.toLowerCase().startsWith('.confess')) isi = isi.slice(8).trim()
    if (isi.toLowerCase().startsWith('confess')) isi = isi.slice(7).trim()
    if (!isi) return m.reply('Ketik confess lu! Contoh: aku suka sama kamu')

    let target = global.confessPending[m.sender]
    delete global.confessPending[m.sender]

    // KIRIM KE GRUP YANG TADI DIA ASAL! OTOMATIS! GAK USAH KETIK NAMA GRUP!
    await conn.sendMessage(target.groupId, { text: `💌 *CONFESS ANONIM!*\n\n"${isi}"\n\n_Dari: Seseorang yang rahasia 🤫_` })
    return m.reply(`✅ Udah gua kirim ke grup *${target.groupName}*! Anonim! Aman!`)
}

handler.help = ['confess']
handler.tags = ['fun']
handler.command = /^confess$/i
export default handler
