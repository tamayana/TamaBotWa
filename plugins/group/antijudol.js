import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const cfg = getGroupSettings(m.chat)
    const label = cfg.antijudol ? (cfg.antijudolKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'

    if (!['on', 'off', 'kick'].includes(mode)) {
        return RaplyGwe(`Status Anti Judol: *${label}*\n\nContoh:\n${usedPrefix}antijudol on  (hapus pesan)\n${usedPrefix}antijudol kick  (hapus + keluarkan pengirim)\n${usedPrefix}antijudol off`)
    }

    setGroupSetting(m.chat, 'antijudol', mode !== 'off')
    setGroupSetting(m.chat, 'antijudolKick', mode === 'kick')

    let text = mode === 'off'
        ? 'Anti Judol berhasil dimatikan.'
        : `Anti Judol berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.group = true
handler.admin = true

export default handler
