import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const current = getGroupSettings(m.chat).welcome

    if (!['on', 'off'].includes(mode)) {
        return RaplyGwe(`Status Welcome: *${current ? 'ON' : 'OFF'}*\n\nContoh:\n${usedPrefix}welcome on\n${usedPrefix}welcome off`)
    }

    const enable = mode === 'on'
    if (current === enable) return RaplyGwe(`Fitur Welcome sudah *${mode.toUpperCase()}* di grup ini.`)

    setGroupSetting(m.chat, 'welcome', enable)
    return RaplyGwe(`Fitur Welcome berhasil di *${enable ? 'aktifkan' : 'matikan'}*.`)
}

handler.help = ['welcome <on/off>']
handler.tags = ['group']
handler.command = /^(welcome)$/i
handler.group = true
handler.admin = true

export default handler
