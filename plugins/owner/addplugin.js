import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { pluginDir, getPluginFiles, loadPlugin, unloadPlugin, getPluginCommands } from '../../handler.js'

const rootDir = path.dirname(pluginDir)
const stagingDir = path.join(rootDir, '.staging', 'tmp')
const folderMap = { downloader: 'download' }
const validName = /^[a-z0-9_-]+$/i
const rel = file => path.relative(pluginDir, file).split(path.sep).join('/')

let handler = async (m, { RaplyGwe }) => {
    const q = m.quoted
    const [head, ...body] = (m.text || '').split('\n')
    const [, nameArg] = head.trim().split(/\s+/)

    let code = body.join('\n')
    let fileName

    try {
        if (q?.mtype === 'documentMessage') {
            fileName = q.fileName || q.msg?.fileName
            code = (await q.download())?.toString('utf8')
        } else if (m.mtype === 'documentMessage') {
            fileName = m.msg?.fileName
            code = (await m.download())?.toString('utf8')
        } else if (q?.text) {
            code = q.text
        }
    } catch (e) {
        return RaplyGwe(`❌ Gagal membaca file: ${e.message}`)
    }

    if (!code?.trim()) {
        return RaplyGwe('Contoh:\n- reply file .js → .addplugin\n- reply kode → .addplugin nama\n- .addplugin nama (kode di baris bawah)')
    }
    if (fileName && !/\.js$/i.test(fileName)) return RaplyGwe('❌ File harus berekstensi .js')

    code = code.replace(/^\s*```[a-z]*\r?\n?/i, '').replace(/\r?\n?```\s*$/, '').trim() + '\n'
    if (Buffer.byteLength(code) > 300 * 1024) return RaplyGwe('❌ Kode terlalu besar (maks 300KB).')
    fs.mkdirSync(stagingDir, { recursive: true })
    const tmp = path.join(stagingDir, `${Date.now()}${Math.random().toString(36).slice(2, 6)}.mjs`)
    fs.writeFileSync(tmp, code)

    let plugin
    try {
        plugin = (await import(pathToFileURL(tmp).href)).default
    } catch (e) {
        return RaplyGwe(`❌ Plugin tidak bisa dimuat:\n${e.name}: ${e.message.split('\n')[0].replaceAll(rootDir, '')}`)
    } finally {
        fs.rmSync(tmp, { force: true })
    }

    if (typeof plugin !== 'function') return RaplyGwe('❌ Plugin harus `export default handler`.')

    const commands = plugin.command instanceof RegExp
        ? [...new Set([].concat(plugin.help ?? [])
            .filter(v => typeof v === 'string' && v.trim())
            .map(v => v.trim().split(/\s+/)[0].toLowerCase()))]
        : [].concat(plugin.command ?? []).map(v => String(v).toLowerCase())
    if (!plugin.command && !plugin.customPrefix) return RaplyGwe('❌ Plugin belum punya `handler.command`.')

    const category = [].concat(plugin.tags ?? plugin.category ?? []).find(v => typeof v === 'string' && v.trim())?.trim().toLowerCase()
    if (!category) return RaplyGwe('❌ Plugin belum punya `handler.tags`.')

    const name = (nameArg || fileName || commands[0] || '').replace(/\.js$/i, '')
    if (!name) return RaplyGwe('❌ Nama plugin tidak ketemu.\nContoh: .addplugin nama')
    if (!validName.test(name) || !validName.test(category)) return RaplyGwe('❌ Nama plugin & kategori hanya boleh huruf, angka, _ dan -')

    const folder = folderMap[category] || category
    const dir = path.join(pluginDir, folder)
    const target = path.join(dir, `${name}.js`)
    const files = getPluginFiles(pluginDir)
    const old = files.find(f => path.basename(f) === `${name}.js` && f !== target)

    for (const f of files) {
        if (f === target || f === old) continue
        const used = getPluginCommands(f).find(c => commands.includes(c))
        if (used) return RaplyGwe(`❌ Command ${used} sudah dipakai plugins/${rel(f)}`)
    }

    const prevTarget = fs.existsSync(target) ? fs.readFileSync(target) : null
    const prevOld = old ? fs.readFileSync(old) : null

    if (old) {
        fs.unlinkSync(old)
        await unloadPlugin(old)
    }

    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(target, code)

    if (!(await loadPlugin(target))) {
        prevTarget ? fs.writeFileSync(target, prevTarget) : fs.rmSync(target, { force: true })
        if (old) {
            fs.writeFileSync(old, prevOld)
            await loadPlugin(old)
        }
        return RaplyGwe('❌ Plugin gagal dimuat (cek console), perubahan dibatalkan.')
    }

    const cmd = getPluginCommands(target).map(v => '.' + v).join(', ') || '-'

    await RaplyGwe(
        `✅ *Plugin berhasil ${prevTarget || old ? 'diupdate' : 'ditambahkan'}*\n` +
        `• File : plugins/${folder}/${name}.js\n` +
        `• Kategori : ${category}\n` +
        `• Command : ${cmd}` +
        (old ? `\n• Dipindah : dari plugins/${path.basename(path.dirname(old))}/` : '')
    )
}

handler.help = ['addplugin <nama>']
handler.tags = ['owner']
handler.command = /^(addplugin|addplug)$/i
handler.creator = true

export default handler
