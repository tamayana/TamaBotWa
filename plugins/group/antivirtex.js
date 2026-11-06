import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const cfg = getGroupSettings(m.chat)
    const label = cfg.antivirtex ? (cfg.antivirtexKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'

    if (!['on', 'off', 'kick'].includes(mode)) {
        return RaplyGwe(`Status Anti Virtex: *${label}*\n\nContoh:\n${usedPrefix}antivirtex on  (hapus pesan virtex)\n${usedPrefix}antivirtex kick  (hapus + keluarkan pengirim)\n${usedPrefix}antivirtex off`)
    }

    setGroupSetting(m.chat, 'antivirtex', mode !== 'off')
    setGroupSetting(m.chat, 'antivirtexKick', mode === 'kick')

    let text = mode === 'off'
        ? 'Anti Virtex berhasil dimatikan.'
        : `Anti Virtex berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antivirtex <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antivirtex)$/i
handler.group = true
handler.admin = true

export default handler
