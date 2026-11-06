import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

const FEATURES = {
    detect: ['detect', 'Detect'],
    adminonly: ['adminOnly', 'Admin only'],
    antidelete: ['delete', 'Anti delete']
}

let handler = async (m, { args, command, prefix, RaplyGwe }) => {
    const [key, label] = FEATURES[command]
    const p = prefix || '.'
    const mode = (args[0] || '').toLowerCase()
    const current = getGroupSettings(m.chat)[key]

    if (!['on', 'off'].includes(mode)) {
        return RaplyGwe(`Status ${label}: *${current ? 'ON' : 'OFF'}*\n\nContoh:\n${p}${command} on\n${p}${command} off`)
    }

    const enable = mode === 'on'
    if (current === enable) return RaplyGwe(`${label} sudah *${mode.toUpperCase()}* di grup ini.`)

    setGroupSetting(m.chat, key, enable)
    await RaplyGwe(`${label} berhasil di ${enable ? 'aktifkan' : 'matikan'}.`)
}

handler.help = ['detect <on/off>', 'adminonly <on/off>', 'antidelete <on/off>']
handler.tags = ['group']
handler.command = /^(detect|adminonly|antidelete)$/i
handler.group = true
handler.admin = true

export default handler
