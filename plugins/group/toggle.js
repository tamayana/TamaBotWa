import { getGroupSettings, setGroupSetting } from '../../lib/database.js'

const FEATURES = {
    detect: ['detect', 'Detect'],
    adminonly: ['adminOnly', 'Admin Only'],
    antidelete: ['delete', 'Anti Delete'],
    welcome: ['welcome', 'Welcome'], // <-- INI YANG HILANG TADI BUNG!
    goodbye: ['welcome', 'Welcome'], // Biar .goodbye on juga bisa, soalnya 1 setting sama welcome!
    left: ['welcome', 'Welcome']
}

let handler = async (m, { args, command, usedPrefix, RaplyGwe }) => {
    const cmd = command.toLowerCase()
    const [key, label] = FEATURES[cmd]
    const p = usedPrefix || '.'
    const mode = (args[0] || '').toLowerCase()

    try {
        const current = getGroupSettings(m.chat)[key]

        if (!['on', 'off'].includes(mode)) {
            return RaplyGwe(`⚙️ Status ${label}: *${current ? 'ON ✅' : 'OFF ❌'}*\n\n*Cara pakai:*\n${p}${cmd} on\n${p}${cmd} off`)
        }

        const enable = mode === 'on'
        if (current === enable) return RaplyGwe(`${label} sudah *${mode.toUpperCase()}* di grup ini.`)

        setGroupSetting(m.chat, key, enable)
        return RaplyGwe(`✅ ${label} berhasil di *${enable ? 'AKTIFKAN' : 'MATIKAN'}*.`)
    } catch (e) {
        console.log(`${cmd.toUpperCase()} TOGGLE ERROR:`, e.message)
        return RaplyGwe(`❌ Gagal ngatur ${label}: ${e.message}`)
    }
}

handler.help = ['detect <on/off>', 'adminonly <on/off>', 'antidelete <on/off>', 'welcome <on/off>']
handler.tags = ['group']
handler.command = /^(detect|adminonly|antidelete|welcome|goodbye|left)$/i
handler.group = true
handler.admin = true

export default handler
