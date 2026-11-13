let handler = async (m, { conn }) => {
    if (!global.db.data.menfes) global.db.data.menfes = {}
    let pasangan = global.db.data.menfes[m.sender]
    if (!pasangan) return m.reply('Kamu lagi gak confess sama siapa-siapa kok!')
    delete global.db.data.menfes[m.sender]
    delete global.db.data.menfes[pasangan]
    await m.reply('Oke! Confess dihentikan! Identitas kamu aman! 🤫')
    try {
        await conn.sendMessage(pasangan, { text: 'Dia udah berhenti confess. Chat berakhir ya! 💌' })
    } catch {}
}
handler.help = ['stopmenfes']
handler.tags = ['mctama']
handler.command = /^(stopmenfes|stopconfess)$/i
export default handler
