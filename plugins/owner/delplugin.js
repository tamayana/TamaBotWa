import fs from 'fs'
import path from 'path'
import { pluginDir, getPluginFiles, unloadPlugin } from '../../handler.js'

const protectedPlugins = ['addplugin', 'delplugin', 'listplugin']
const rel = file => path.relative(pluginDir, file).split(path.sep).join('/')

let handler = async (m, { args, RaplyGwe }) => {
    if (!args[0]) return RaplyGwe('Contoh:\n.delplugin nama\n.delplugin kategori/nama')

    const input = args[0].replace(/\\/g, '/').replace(/\.js$/i, '').replace(/^\/+|\/+$/g, '')
    if (!/^[a-z0-9_\-/]+$/i.test(input) || input.includes('..')) return RaplyGwe('❌ Nama plugin tidak valid.')

    const name = input.split('/').pop()
    if (protectedPlugins.includes(name.toLowerCase())) return RaplyGwe(`❌ Plugin ${name} dilindungi dan tidak bisa dihapus.`)

    const found = getPluginFiles(pluginDir).filter(f => {
        const p = rel(f).replace(/\.js$/, '')
        return input.includes('/') ? p === input : path.basename(p) === input
    })

    if (!found.length) return RaplyGwe(`❌ Plugin ${input}.js tidak ditemukan.\nCek dengan .listplugin`)
    if (found.length > 1) {
        const list = found.map(f => '• ' + rel(f).replace(/\.js$/, '')).join('\n')
        return RaplyGwe(`Ada ${found.length} plugin bernama ${input}:\n${list}\n\nContoh: .delplugin kategori/${input}`)
    }

    try {
        fs.unlinkSync(found[0])
        await unloadPlugin(found[0])
    } catch (e) {
        return RaplyGwe(`❌ Gagal menghapus: ${e.message}`)
    }

    await RaplyGwe(`🗑️ *Plugin berhasil dihapus*\n• File : plugins/${rel(found[0])}`)
}

handler.help = ['delplugin <nama>']
handler.tags = ['owner']
handler.command = /^(delplugin|delplug)$/i
handler.creator = true

export default handler
