import config from '../../config.js'
import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

/// ─────────── [ 𝖥𝗂𝗅𝗍𝖾𝗋 𝖫𝗂𝗇𝗄 ] ────────── ///
const LINK_REGEX = /(?:https?:\/\/|www\.)\S+|\b(?:chat\.whatsapp\.com|wa\.me|t\.me)\/\S+/i

let handler = async (m, { conn, args, command, prefix, RaplyGwe, isAdmin, isBotAdmin, isOld }) => {
    if (command) {
        if (!m.isGroup) return RaplyGwe(config.accessDenied.group)

        if (!isAdmin && !m.isOwner) return RaplyGwe(config.accessDenied.admin)

        const p = prefix || '.'
        const mode = (args[0] || '').toLowerCase()
        const current = getGroupSettings(m.chat).antilink

        if (!['on', 'off'].includes(mode)) {
            return RaplyGwe(`Status: *${current ? 'ON' : 'OFF'}*\n\nContoh:\n${p}antilink on\n${p}antilink off`)
        }

        const enable = mode === 'on'
        if (current === enable) return RaplyGwe(`Antilink sudah *${mode.toUpperCase()}* di grup ini.`)

        setGroupSetting(m.chat, 'antilink', enable)
        let text = `Antilink berhasil di${enable ? 'aktifkan' : 'matikan'}.`

        if (enable) {
            const fresh = await conn.groupMetadata(m.chat).catch(() => null)
            const botIds = [conn.user?.id, conn.user?.lid].filter(Boolean).map(v => v.replace(/:\d+@/, '@'))
            const botAdmin = fresh?.participants?.some(p => p.admin && [p.id, p.lid].some(v => v && botIds.includes(v.replace(/:\d+@/, '@'))))
            if (!botAdmin) text += '\n\n⚠️ Bot belum jadi Admin grup, jadikan Admin supaya bisa menghapus pesan.'
        }
        return RaplyGwe(text)
    }

    if (!m.isGroup || m.fromMe || m.isOwner || isOld) return
    if (!getGroupSettings(m.chat).antilink) return
    if (!LINK_REGEX.test(m.text || '')) return

    if (isAdmin || !isBotAdmin) return

    await conn.sendMessage(m.chat, { delete: m.key })
    await conn.sendMessage(m.chat, {
        text: `*Anti Link*\n\n@${m.sender.split('@')[0]} terdeteksi mengirim link, pesan dihapus.`,
        mentions: [m.sender]
    })
}

handler.help = ['antilink <on/off>']
handler.tags = ['group']
handler.command = /^(antilink)$/i
handler.customPrefix = LINK_REGEX

export default handler
