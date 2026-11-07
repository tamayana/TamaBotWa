let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply('Perintah ini cuma bisa di grup bung!')
    
    let botAdmin = m.isGroup ? (await conn.groupMetadata(m.chat)).participants.find(p => p.id === conn.user.jid)?.admin : false
    if (!botAdmin) return m.reply('Bot harus jadi admin dulu bung biar bisa nambahin orang!')

    if (!args[0]) return m.reply(`Contoh: *${usedPrefix + command} 628123456789*`)

    let no = args[0].replace(/[^0-9]/g, '')
    if (no.startsWith('0')) no = '62' + no.slice(1)
    if (no.length < 10) return m.reply('Nomor nya salah bung!')

    let user = no + '@s.whatsapp.net'
    
    // INI KUNCI NYA BUNG! AMBIL NAMA WA NYA LANGSUNG!
    let nama = await conn.getName(user) || no

    m.reply(`Lagi nambahin *${nama}* nih, tunggu...`)

    try {
        let res = await conn.groupParticipantsUpdate(m.chat, [user], 'add')
        let status = res[0]?.status
        
        if (status == 200) {
            // Pake tag biar nama nya muncul sesuai nama WA nya
            await conn.sendMessage(m.chat, { text: `✅ Berhasil! @${no} (${nama}) udah dimasukin ke grup!`, mentions: [user] }, { quoted: m })
        } else if (status == 403) {
            m.reply(`❌ Gagal nambahin *${nama}* bung! Privasi WA nya terkunci, jadi bot gak bisa add! Suruh dia join pake link grup aja!`)
        } else if (status == 408) {
            m.reply(`❌ Gagal nambahin *${nama}* bung! Dia baru aja keluar dari grup ini, jadi gak bisa langsung di-add lagi!`)
        } else {
            m.reply(`Gagal nambahin *${nama}* bung! Status: ${status}`)
        }
    } catch (e) {
        m.reply(`Gagal nambahin *${nama}* bung! Pastikan nomor nya bener dan bot nya admin!`)
    }
}

handler.help = ['add']
handler.tags = ['group']
handler.command = /^(add|tambah)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
