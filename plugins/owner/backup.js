import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { zipSync } from 'fflate'
import config from '../../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '../..')
const ownerPath = path.join(rootDir, 'database/owner.json')
const skip = ['node_modules', 'session', '.git', '.staging', '.npm', '.cache']

const walk = (dir, out = {}) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        if (skip.includes(item.name) || item.name.endsWith('.zip')) continue
        const full = path.join(dir, item.name)
        if (item.isDirectory()) walk(full, out)
        else if (item.isFile()) out[path.relative(rootDir, full).split(path.sep).join('/')] = fs.readFileSync(full)
    }
    return out
}

let handler = async (m, { conn, RaplyGwe }) => {
    await m.react('⌛')

    try {
        let owner = []
        try { owner = JSON.parse(fs.readFileSync(ownerPath, 'utf8')) } catch {}

        const targets = [...new Set([...(config.creator || []), ...owner]
            .map(v => String(v).split('@')[0].replace(/[^0-9]/g, ''))
            .filter(Boolean))]
            .map(v => v + '@s.whatsapp.net')

        const zip = Buffer.from(zipSync(walk(rootDir), { level: 6 }))
        const waktu = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16).replace(' ', '-').replace(':', '')
        const fileName = `Backup-${waktu}.zip`
        const size = (zip.length / 1024 / 1024).toFixed(2)

        let sukses = 0
        for (const jid of targets) {
            try {
                await conn.sendMessage(jid, {
                    document: zip,
                    mimetype: 'application/zip',
                    fileName,
                    caption: `▢ Size: ${size} MB`
                })
                sukses++
            } catch {}
        }

        if (!sukses) throw new Error('Gagal mengirim backup ke semua owner')

        await m.react('✅')
        await RaplyGwe(`Backup berhasil dikirim ke owner.`)
    } catch (e) {
        await m.react('❌')
        await RaplyGwe(`Gagal membuat backup: ${e.message}`)
    }
}

handler.help = ['backup']
handler.tags = ['owner']
handler.command = /^(backup|backupsc|bk)$/i
handler.creator = true

export default handler
