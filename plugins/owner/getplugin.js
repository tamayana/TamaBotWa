import fs from 'fs'
import path from 'path'
import { pluginDir, getPluginFiles } from '../../handler.js'

const rel = file => path.relative(pluginDir, file).split(path.sep).join('/')

let handler = async (m, { conn, args, RaplyGwe }) => {
    if (!args[0]) return RaplyGwe('Contoh:\n.getplugin nama\n.getplugin kategori/nama')

    const input = args[0].replace(/\\/g, '/').replace(/\.js$/i, '').replace(/^\/+|\/+$/g, '')
    if (!/^[a-z0-9_\-/]+$/i.test(input) || input.includes('..')) return RaplyGwe('❌ Nama plugin tidak valid.')

    const found = getPluginFiles(pluginDir).filter(f => {
        const p = rel(f).replace(/\.js$/, '')
        return input.includes('/') ? p === input : path.basename(p) === input
    })

    if (!found.length) return RaplyGwe(`❌ Plugin ${input}.js tidak ditemukan.\nCek dengan .listplugin`)
    if (found.length > 1) {
        const list = found.map(f => '• ' + rel(f).replace(/\.js$/, '')).join('\n')
        return RaplyGwe(`Ada ${found.length} plugin bernama ${input}:\n${list}\n\nContoh: .getplugin kategori/${input}`)
    }

    try {
        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(found[0]),
            mimetype: 'application/javascript',
            fileName: path.basename(found[0]),
            caption: `📄 plugins/${rel(found[0])}`
        }, { quoted: m })
    } catch (e) {
        await RaplyGwe(`❌ Gagal mengirim plugin: ${e.message}`)
    }
}

handler.help = ['getplugin <nama>']
handler.tags = ['owner']
handler.command = /^(getplugin|getplug)$/i
handler.creator = true

export default handler
