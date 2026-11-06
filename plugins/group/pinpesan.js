const Duration = {
    '24j': [86400, '24 jam'], '24jam': [86400, '24 jam'], '1h': [86400, '24 jam'], '1d': [86400, '24 jam'], '1hari': [86400, '24 jam'], '24': [86400, '24 jam'],
    '7h': [604800, '7 hari'], '7d': [604800, '7 hari'], '7hari': [604800, '7 hari'], '7': [604800, '7 hari'],
    '30h': [2592000, '30 hari'], '30d': [2592000, '30 hari'], '30hari': [2592000, '30 hari'], '30': [2592000, '30 hari']
}

let handler = async (m, { conn, args, usedPrefix, command, RaplyGwe }) => {
    const cmd = command.toLowerCase()
    const unpin = /^(unpin|unpinpesan)$/i.test(cmd) || /^(off|lepas|unpin)$/i.test(args[0] || '')

    if (!m.quoted?.key?.id) {
        return RaplyGwe(`Balas pesan yang mau di-pin.\n\nContoh:\n${usedPrefix}pinpesan  (7 hari)\n${usedPrefix}pinpesan 24j\n${usedPrefix}pinpesan 30h\n${usedPrefix}unpin  (lepas pin)`, 'Pin Pesan')
    }

    let seconds = 604800, label = '7 hari'
    if (!unpin && args[0]) {
        const chosen = Duration[args[0].toLowerCase()]
        if (!chosen) return RaplyGwe('Durasi tidak valid. Pilihan: *24j*, *7h*, atau *30h*.', 'Pin Pesan')
        ;[seconds, label] = chosen
    }

    try {
        await conn.sendMessage(m.chat, unpin
            ? { pin: m.quoted.key, type: 2 }
            : { pin: m.quoted.key, type: 1, time: seconds })
        await m.react(unpin ? '📍' : '📌')
        return RaplyGwe(unpin ? 'Pin pada pesan berhasil dilepas.' : `Pesan berhasil di-pin selama *${label}*.`, 'Pin Pesan')
    } catch (e) {
        console.error('[pinpesan]', e)
        return RaplyGwe(`Gagal ${unpin ? 'melepas pin' : 'mem-pin pesan'}. Pastikan bot admin grup dan pesan masih ada.`, 'Pin Pesan')
    }
}

handler.help = ['pinpesan <24j/7h/30h>', 'unpin']
handler.tags = ['group']
handler.command = /^(pinpesan|pin|unpin|unpinpesan)$/i
handler.group = true
handler.admin = true

export default handler
