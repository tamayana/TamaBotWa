import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const current = !!getGroupSettings(m.chat).antiswgc

    if (!['on', 'off'].includes(mode)) {
        return RaplyGwe(`Status Anti SWGC: *${current ? 'ON' : 'OFF'}*\n\nContoh:\n${usedPrefix}antiswgc on\n${usedPrefix}antiswgc off`)
    }

    const enable = mode === 'on'
    if (current === enable) return RaplyGwe(`Anti SWGC sudah *${mode.toUpperCase()}* di grup ini.`)

    setGroupSetting(m.chat, 'antiswgc', enable)
    let text = `Anti SWGC berhasil di${enable ? 'aktifkan' : 'matikan'}.`
    if (enable && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antiswgc <on/off>']
handler.tags = ['group']
handler.command = /^(antiswgc)$/i
handler.group = true
handler.admin = true

export default handler
