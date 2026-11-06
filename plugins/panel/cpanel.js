import crypto from 'crypto'
import config from '../../config.js'
import { tanggal } from '../../lib/myfunc.js'
import { Listpanel, capital, isPterodactyl, pteroRequest, pteroError, sendAccount } from '../../lib/panel.js'

let handler = async (m, { conn, text, command, prefix, RaplyGwe }) => {
    if (!isPterodactyl()) return RaplyGwe(`𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖣𝗎𝗅𝗎 𝖠𝗉𝗂𝗄𝖾𝗒 𝖯𝖺𝗇𝖾𝗅 𝖡𝗈𝗌𝗌!!`)

    const spec = Listpanel[command]
    const p = prefix || '.'

    if (!text.trim()) {
        return RaplyGwe(`Contoh:\n${p}${command} nama\n${p}${command} nama,628xxx`)
    }

    /// ─────────── [ 𝖯𝖺𝗋𝗌𝗂𝗇𝗀 𝖨𝗇𝗉𝗎𝗍 ] ────────── ///
    const input = text.split(',')
    const nama = input[0].trim()
    const base = nama.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!base) return RaplyGwe('Nama tidak valid, gunakan huruf atau angka.')

    let nomor = null
    if (input[1]) {
        nomor = input[1].replace(/[^0-9]/g, '')
        if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1)
        if (!nomor.startsWith('62')) nomor = '62' + nomor
        if (nomor.length < 10) return RaplyGwe('Nomor tidak valid.')

        const cek = await conn.onWhatsApp(nomor + '@s.whatsapp.net').catch(() => [])
        if (!cek?.length || !cek[0]?.exists) return RaplyGwe('Nomor tidak terdaftar di WhatsApp.')
    }

    const { nestid, egg, loc } = config.panel

    try {
        const username = base + crypto.randomBytes(2).toString('hex')
        const email = username + '@gmail.com'
        const name = capital(nama) + ' Server'
        const password = username + crypto.randomBytes(2).toString('hex')

        /// ─────────── [ 𝖡𝗎𝖺𝗍 𝖴𝗌𝖾𝗋 ] ────────── ///
        const createUser = await pteroRequest('/api/application/users', 'POST', {
            email,
            username,
            first_name: name,
            last_name: nomor || 'default',
            language: 'en',
            password
        })
        if (!createUser.ok) return RaplyGwe(`Gagal membuat user:\n${pteroError(createUser)}`)

        const user = createUser.data.attributes

        /// ─────────── [ 𝖧𝖺𝗉𝗎𝗌 𝖴𝗌𝖾𝗋 𝖩𝗂𝗄𝖺 𝖯𝗋𝗈𝗌𝖾𝗌 𝖲𝖾𝗋𝗏𝖾𝗋 𝖦𝖺𝗀𝖺𝗅 ] ────────── ///
        const rollback = () => pteroRequest(`/api/application/users/${user.id}`, 'DELETE').catch(() => {})

        /// ─────────── [ 𝖠𝗆𝖻𝗂𝗅 𝖲𝗍𝖺𝗋𝗍𝗎𝗉 𝖤𝗀𝗀 ] ────────── ///
        const eggRes = await pteroRequest(`/api/application/nests/${nestid}/eggs/${egg}`)
        if (!eggRes.ok) {
            await rollback()
            return RaplyGwe(`Gagal mengambil data egg:\n${pteroError(eggRes)}`)
        }

        /// ─────────── [ 𝖡𝗎𝖺𝗍 𝖲𝖾𝗋𝗏𝖾𝗋 ] ────────── ///
        const createServer = await pteroRequest('/api/application/servers', 'POST', {
            name,
            description: tanggal(Date.now()),
            user: user.id,
            egg: parseInt(egg),
            docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
            startup: eggRes.data.attributes.startup,
            environment: { INST: 'npm', USER_UPLOAD: '0', AUTO_UPDATE: '0', CMD_RUN: 'npm start' },
            limits: { memory: spec.ram, swap: 0, disk: spec.disk, io: 500, cpu: spec.cpu },
            feature_limits: { databases: 5, backups: 5, allocations: 5 },
            deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] }
        })
        if (!createServer.ok) {
            await rollback()
            return RaplyGwe(`Gagal membuat server:\n${pteroError(createServer)}`)
        }

        const server = createServer.data.attributes

        /// ─────────── [ 𝖪𝗂𝗋𝗂𝗆 𝖣𝖺𝗍𝖺 𝖠𝗄𝗎𝗇 ] ────────── ///
        const target = nomor ? nomor + '@s.whatsapp.net' : (m.isGroup ? m.sender : m.chat)
        if (m.isGroup || nomor) {
            await RaplyGwe('*Berhasil membuat panel ✅*\n`Data akun sudah dikirim ke private chat`')
        }

        await sendAccount(conn, {
            chat: target,
            fallback: m.sender,
            user,
            password,
            serverId: server.id,
            spec
        })
    } catch (e) {
        await RaplyGwe(`❌ Error: ${e.message}`)
    }
}

handler.help = Object.keys(Listpanel).map(v => `${v} <nama,628xxx>`)
handler.tags = ['panel']
handler.command = new RegExp(`^(${Object.keys(Listpanel).join('|')})$`, 'i')
handler.owner = true

export default handler
