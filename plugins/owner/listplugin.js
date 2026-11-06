import path from 'path'
import { pluginDir, getPluginFiles } from '../../handler.js'

let handler = async (m, { RaplyGwe }) => {
    const groups = {}

    for (const file of getPluginFiles(pluginDir)) {
        const folder = path.basename(path.dirname(file))
        ;(groups[folder] ||= []).push(path.basename(file))
    }

    const folders = Object.keys(groups).sort()
    if (!folders.length) return RaplyGwe('Belum ada plugin.')

    let total = 0
    const text = folders.map(folder => {
        const list = groups[folder].sort()
        total += list.length
        return `📂 *${folder}* #${list.length}\n` + list.map((f, i) => `${i === list.length - 1 ? '└' : '├'} ${f}`).join('\n')
    }).join('\n\n')

    await RaplyGwe(`${text}\n\n> *Total Plugin:* \`${total}\``)
}

handler.help = ['listplugin']
handler.tags = ['owner']
handler.command = /^(listplugin|listplug)$/i
handler.owner = true

export default handler
