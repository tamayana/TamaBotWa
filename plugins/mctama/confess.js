let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Cara pakai:\n${usedPrefix + command} gua suka sama si A`)

    // 1. HAPUS PESAN ASLI LU BIAR GAK KETAUAN!
    try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

    // 2. KIRIM CONFESS NYA KE GRUP, TANPA QUOTE! TANPA NAMA!
    await conn.sendMessage(m.chat, {
        text: `💌 *CONFESS ANONIM!*\n\n"${text}"\n\n_Dari: Seseorang yang rahasia 🤫_`
    })

    // 3. KONFIRMASI NYA LEWAT JAPRI, BUKAN DI GRUP! BIAR GAK KETAUAN!
    await conn.sendMessage(m.sender, {
        text: `Confess lu udah terkirim! Anonim! Aman!\n\nIsi: "${text}"`
    }).catch(() => {})
}

handler.help = ['confess']
handler.tags = ['fun']
handler.command = /^confess$/i
handler.group = true

export default handler
