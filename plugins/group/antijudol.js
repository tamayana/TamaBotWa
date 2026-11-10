import { getGroupSettings, setGroupSettings } from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, isBotAdmin, RaplyGwe }) => {
    const reply = RaplyGwe || m.reply
    const mode = (args[0] || '').toLowerCase()
    const cfg = getGroupSettings(m.chat)
    const label = cfg.antijudol ? (cfg.antijudolKick ? 'ON (hapus + kick)' : 'ON (hapus)') : 'OFF'
    if (!['on', 'off', 'kick'].includes(mode)) {
        return reply(`Status Anti Judol: *${label}*\n\nContoh:\n${usedPrefix}antijudol on\n${usedPrefix}antijudol kick\n${usedPrefix}antijudol off`)
    }
    setGroupSettings(m.chat, 'antijudol', mode !== 'off')
    setGroupSettings(m.chat, 'antijudolKick', mode === 'kick')
    let text = mode === 'off' ? 'Anti Judol berhasil dimatikan.' : `Anti Judol berhasil diaktifkan${mode === 'kick' ? ' (mode hapus + kick)' : ''}.`
    if (mode !== 'off' && !isBotAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
    return reply(text)
}

handler.help = ['antijudol <on/off/kick>']
handler.tags = ['group']
handler.command = /^(antijudol)$/i
handler.group = true
handler.admin = true
export default handler
