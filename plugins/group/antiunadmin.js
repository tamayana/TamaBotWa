import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const current = !!getGroupSettings(m.chat).antiunadmin

    if (!['on', 'off'].includes(mode)) {
        return RaplyGwe(`Status Anti Unadmin: *${current ? 'ON' : 'OFF'}*\n\nContoh:\n${usedPrefix}antiunadmin on\n${usedPrefix}antiunadmin off`)
    }

    const enable = mode === 'on'
    if (current === enable) return RaplyGwe(`Anti Unadmin sudah *${mode.toUpperCase()}* di grup ini.`)

    setGroupSetting(m.chat, 'antiunadmin', enable)
    let text = `Anti Unadmin berhasil di${enable ? 'aktifkan' : 'matikan'}.`
    if (enable && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa mengembalikan admin.'
    return RaplyGwe(text)
}

handler.help = ['antiunadmin <on/off>']
handler.tags = ['group']
handler.command = /^(antiunadmin)$/i
handler.group = true
handler.admin = true

export default handler
