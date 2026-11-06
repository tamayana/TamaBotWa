import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const cfg = getGroupSettings(m.chat)
    const label = cfg.antispam ? (cfg.antispamKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'

    if (!['on', 'off', 'kick'].includes(mode)) {
        return RaplyGwe(`Status Anti Spam: *${label}*\n\nContoh:\n${usedPrefix}antispam on  (hapus pesan spam)\n${usedPrefix}antispam kick  (hapus + keluarkan pengirim)\n${usedPrefix}antispam off`)
    }

    setGroupSetting(m.chat, 'antispam', mode !== 'off')
    setGroupSetting(m.chat, 'antispamKick', mode === 'kick')

    let text = mode === 'off'
        ? 'Anti Spam berhasil dimatikan.'
        : `Anti Spam berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antispam <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antispam)$/i
handler.group = true
handler.admin = true

export default handler
