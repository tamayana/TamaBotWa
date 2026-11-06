import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

/// ─────────── [ Perintah On / Off / Kick ] ────────── ///
let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const cfg = getGroupSettings(m.chat)
    const label = cfg.antibot ? (cfg.antibotKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'

    if (!['on', 'off', 'kick'].includes(mode)) {
        return RaplyGwe(`Status Anti Bot: *${label}*\n\nContoh:\n${usedPrefix}antibot on  (hapus pesan bot)\n${usedPrefix}antibot kick  (hapus + keluarkan bot)\n${usedPrefix}antibot off`)
    }

    setGroupSetting(m.chat, 'antibot', mode !== 'off')
    setGroupSetting(m.chat, 'antibotKick', mode === 'kick')

    let text = mode === 'off'
        ? 'Anti Bot berhasil dimatikan.'
        : `Anti Bot berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antibot <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antibot)$/i
handler.group = true
handler.admin = true

export default handler
