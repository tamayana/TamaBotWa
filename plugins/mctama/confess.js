if (!global.confessPending) global.confessPending = {}
if (!global.confessDelete) global.confessDelete = new Set()

let handler = async (m, { conn }) => {
    // PAKE m.text BIAR | NYA GAK ILANG
    let raw = (m.text || '').trim()
    // BUANG PREFIX + COMMAND NYA, SISAIN ARGUMEN NYA DOANG
    // .confess TamaBotWa | yal -> jadi "TamaBotWa | yal"
    let body = raw.replace(/^[./!#?]*confess/i, '').trim()

    // ===== 1. KALO DI GRUP =====
    if (m.isGroup) {
        // BIAR ANTI DELETE GAK NANGKEP
        global.confessDelete.add(m.key.id)
        try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

        let groupName = 'grup tadi'
        try {
            let meta = await conn.groupMetadata(m.chat).catch(() => null)
            if (meta) groupName = meta.subject
        } catch {}
        global.confessPending[m.sender] = { groupId: m.chat, groupName, time: Date.now() }

        await conn.sendMessage(m.sender, {
            text: `Hai! Lu tadi mau confess di grup *${groupName}* ya?\n\nTinggal ketik aja confess lu disini! Nanti gua kirim ke grup *${groupName}* anonim!\n\nKalo udah hafal, next time langsung japri aja:\n*.confess ${groupName} | isi confess lu*`
        }).catch(() => {})
        return
    }

    // ===== 2. KALO DI JAPRI =====
    // 2A. MODE PRO: ADA | -> .confess TamaBotWa | yal
    if (body.includes('|')) {
        let [namaGrup, ...isiArr] = body.split('|')
        namaGrup = namaGrup.trim()
        let isi = isiArr.join('|').trim()
        if (!namaGrup || !isi) return m.reply(`Formatnya: *.confess NamaGrup | isi*\nContoh: *.confess TamaBotWa | aku suka kamu*`)

        let allGroups = await conn.groupFetchAllParticipating().catch(() => ({}))
        let list = Object.values(allGroups)
        let found = list.find(g => (g.subject || '').toLowerCase() === namaGrup.toLowerCase())
        if (!found) found = list.find(g => (g.subject || '').toLowerCase().includes(namaGrup.toLowerCase()))

        if (!found) return m.reply(`Grup *${namaGrup}* gak ketemu! Bot harus udah masuk ke grup itu! Coba ketik *.confess* dulu di grup itu!`)

        await conn.sendMessage(found.id, { text: `💌 *CONFESS ANONIM!*\n\n"${isi}"\n\n_Dari: Seseorang yang rahasia 🤫_` })
        return m.reply(`✅ Udah gua kirim ke grup *${found.subject}*! Anonim! Aman!`)
    }

    // 2B. MODE PEMULA: UDAH PERNAH .confess DI GRUP, TINGGAL KETIK ISI NYA
    if (global.confessPending[m.sender]) {
        let isi = body.trim()
        if (!isi) return m.reply('Ketik confess lu! Contoh: aku suka sama kamu')
        let target = global.confessPending[m.sender]
        delete global.confessPending[m.sender]
        await conn.sendMessage(target.groupId, { text: `💌 *CONFESS ANONIM!*\n\n"${isi}"\n\n_Dari: Seseorang yang rahasia 🤫_` })
        return m.reply(`✅ Udah gua kirim ke grup *${target.groupName}*! Anonim! Aman!`)
    }

    // 2C. GAK ADA | GAK ADA PENDING
    return m.reply(`Lu mau confess ke grup mana?\n\nCara 1 (Pemula):\nBalik ke grup, ketik: *.confess*\n\nCara 2 (Cepet):\nJapri gua: *.confess TamaBotWa | isi lu*`)
}

handler.help = ['confess']
handler.tags = ['mctama']
handler.command = /^confess$/i
export default handler
