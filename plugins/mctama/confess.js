if (!global.confessPending) global.confessPending = {}
if (!global.confessDelete) global.confessDelete = new Set()

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let isiFull = text.trim()

    // ===== 1. KALO DI GRUP =====
    if (m.isGroup) {
        // HAPUS BIAR GAK KETAUAN
        global.confessDelete.add(m.key.id)
        try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

        // INGET GRUP NYA
        let groupName = 'grup tadi'
        try {
            let meta = await conn.groupMetadata(m.chat).catch(() => null)
            if (meta) groupName = meta.subject
        } catch {}
        global.confessPending[m.sender] = { groupId: m.chat, groupName, time: Date.now() }

        // JAPRI DIA
        await conn.sendMessage(m.sender, {
            text: `Hai! Lu tadi mau confess di grup *${groupName}* ya?\n\nTinggal ketik aja confess lu disini! Nanti gua kirim ke grup *${groupName}* anonim!\n\nKalo lu udah hafal, next time lu bisa langsung japri aja gini:\n*.confess ${groupName} | isi confess lu*\n\nGak usah balik ke grup lagi!`
        }).catch(() => {})
        return
    }

    // ===== 2. KALO DI JAPRI =====
    // 2A. JAPRI DENGAN FORMAT: .confess NamaGrup | isi
    // Contoh: .confess TamaBotWa | mantap
    if (isiFull.toLowerCase().startsWith('confess') || isiFull.toLowerCase().startsWith('.confess')) {
        let after = isiFull.replace(/^\.?confess/i, '').trim()
        // Kalo ada | berarti dia mode PRO, udah tau nama grup!
        if (after.includes('|')) {
            let [namaGrup, ...isiArr] = after.split('|')
            namaGrup = namaGrup.trim()
            let isi = isiArr.join('|').trim()
            if (!namaGrup || !isi) return m.reply(`Formatnya: *.confess NamaGrup | isi*\nContoh: *.confess TamaBotWa | aku suka kamu*`)

            // CARI GRUP NYA DI DAFTAR GRUP BOT
            let allGroups = await conn.groupFetchAllParticipating().catch(() => ({}))
            let found = Object.values(allGroups).find(g => g.subject.toLowerCase() === namaGrup.toLowerCase())
            if (!found) found = Object.values(allGroups).find(g => g.subject.toLowerCase().includes(namaGrup.toLowerCase()))

            if (!found) return m.reply(`Grup *${namaGrup}* gak ketemu! Coba cek nama grup nya bener gak? Atau ketik *.confess* di grup itu dulu biar gua tau!`)

            await conn.sendMessage(found.id, { text: `💌 *CONFESS ANONIM!*\n\n"${isi}"\n\n_Dari: Seseorang yang rahasia 🤫_` })
            return m.reply(`✅ Udah gua kirim ke grup *${found.subject}*! Anonim! Aman!`)
        }

        // Kalo .confess doang di japri tapi gak ada | dan gak ada pending, kasih tau 2 cara
        if (!global.confessPending[m.sender]) {
            return m.reply(`Lu mau confess ke grup mana?\n\nAda 2 cara:\n\n1. CARA GAMPANG (Buat pemula):\nBalik ke grup lu, ketik di grup: *.confess*\nNanti gua yang japri lu!\n\n2. CARA CEPET (Kalo lu udah tau):\nJapri gua langsung gini:\n*.confess NamaGrup | isi confess lu*\nContoh: *.confess TamaBotWa | mantap*`)
        }
        // Kalo ada pending, lanjut ke bawah (anggap isi nya = confess)
        isiFull = after || isiFull
    }

    // 2B. JAPRI BIASA TAPI UDAH PERNAH .confess DI GRUP = ANGGAP ITU ISI CONFESS
    if (global.confessPending[m.sender]) {
        let isi = isiFull.replace(/^\.?confess/i, '').trim()
        if (!isi) return m.reply('Ketik confess lu! Contoh: aku suka sama kamu')
        let target = global.confessPending[m.sender]
        delete global.confessPending[m.sender]
        await conn.sendMessage(target.groupId, { text: `💌 *CONFESS ANONIM!*\n\n"${isi}"\n\n_Dari: Seseorang yang rahasia 🤫_` })
        return m.reply(`✅ Udah gua kirim ke grup *${target.groupName}*! Anonim! Aman!\n\nNext time lu bisa langsung japri aja: *.confess ${target.groupName} | isi lu*`)
    }

    // 2C. JAPRI TAPI GAK ADA PENDING + GAK ADA FORMAT = KASIH TAU CARA NYA
    return m.reply(`Lu mau confess ke grup mana?\n\nKetik di grup lu: *.confess*\nAtau langsung japri: *.confess NamaGrup | isi lu*`)
}

handler.help = ['confess']
handler.tags = ['mctama']
handler.command = /^confess$/i
export default handler
