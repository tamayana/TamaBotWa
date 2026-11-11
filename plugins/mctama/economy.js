let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = { money: 0, lastDaily: 0 }
        user = global.db.data.users[m.sender]
    }
    if (!user.money) user.money = 0
    if (command === 'dompet' || command === 'saldo' || command === 'money') {
        return m.reply(`*💰 DOMPET LU!*\n\nNama: @${m.sender.split('@')[0]}\nSaldo: *${user.money} Koin* 🪙\n\nKetik *.daily* buat klaim harian!`)
    }
    if (command === 'daily' || command === 'klaim') {
        let now = Date.now()
        let cooldown = 24 * 60 * 60 * 1000
        if (now - (user.lastDaily || 0) < cooldown) {
            let sisa = Math.ceil((cooldown - (now - user.lastDaily)) / 3600000)
            return m.reply(`Udah klaim woy! Besok lagi! Sisa ${sisa} jam lagi!`)
        }
        let dapet = 1000 + Math.floor(Math.random() * 500)
        user.money += dapet
        user.lastDaily = now
        return m.reply(`*DAILY CLAIM BERHASIL!* 🎉\n\nLu dapet *${dapet} Koin*!\nSaldo sekarang: *${user.money} Koin*!`)
    }
    if (command === 'transfer' || command === 'tf') {
        let target = m.mentionedJid?.[0]
        let jumlah = parseInt(args[1] || args[0])
        if (!target) return m.reply(`Cara pakai: *${usedPrefix}transfer @temen 500*`)
        if (!jumlah || jumlah <= 0) return m.reply('Jumlahnya berapa woy?')
        if (user.money < jumlah) return m.reply(`Saldo lu kurang! Saldo lu cuma ${user.money}!`)
        if (!global.db.data.users[target]) global.db.data.users[target] = { money: 0 }
        user.money -= jumlah
        global.db.data.users[target].money = (global.db.data.users[target].money || 0) + jumlah
        return m.reply(`*TRANSFER BERHASIL!* 💸\n\nLu kirim *${jumlah} Koin* ke @${target.split('@')[0]}!\nSaldo lu sekarang: *${user.money}*!`)
    }
}
handler.help = ['dompet', 'daily', 'transfer']
handler.tags = ['game']
handler.command = /^(dompet|saldo|money|daily|klaim|transfer|tf)$/i
export default handler
