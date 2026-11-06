import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const mode = (args[0] || '').toLowerCase()
    const current = !!getGroupSettings(m.chat).antitagsw

    if (!['on', 'off'].includes(mode)) {
        return RaplyGwe(`Status Antitagsw: *${current ? 'ON' : 'OFF'}*\n\nContoh:\n${usedPrefix}antitagsw on\n${usedPrefix}antitagsw off`)
    }

    const enable = mode === 'on'
    if (current === enable) return RaplyGwe(`Antitagsw sudah *${mode.toUpperCase()}* di grup ini.`)

    setGroupSetting(m.chat, 'antitagsw', enable)
    let text = `Antitagsw berhasil di ${enable ? 'aktifkan' : 'matikan'}.`
    if (enable && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antitagsw <on/off>']
handler.tags = ['group']
handler.command = /^(antitagsw)$/i
handler.group = true
handler.admin = true

export default handler
