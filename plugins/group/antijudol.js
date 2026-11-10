import config from '../../config.js'
import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

let handler = async (m, { conn, args, command, usedPrefix, RaplyGwe, isAdmin, isBotAdmin }) => {
    if (!m.isGroup) return RaplyGwe(config.accessDenied.group)
    if (!isAdmin && !m.isOwner) return RaplyGwe(config.accessDenied.admin)
    const p = usedPrefix || '.'
    const mode = (args[0] || '').toLowerCase()
    const current = getGroupSettings(m.chat).antijudol
    if (!['on', 'off', 'kick'].includes(mode)) {
        return RaplyGwe(`🎰 Status Anti Judol: *${current ? 'ON ✅' : 'OFF ❌'}*\n\n*Cara pakai:*\n${p}antijudol on\n${p}antijudol kick\n${p}antijudol off`)
    }
    const enable = mode !== 'off'
    const kickMode = mode === 'kick'
    setGroupSetting(m.chat, 'antijudol', enable)
    setGroupSetting(m.chat, 'antijudolKick', kickMode)
    let text = `✅ Anti Judol berhasil di *${enable ? 'AKTIFKAN' : 'MATIKAN'}*${kickMode ? ' (mode hapus + kick)' : ''}.`
    if (enable && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return RaplyGwe(text)
}

handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i

export default handler
