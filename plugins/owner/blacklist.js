import config from '../../config.js'
import { addBlacklist, delBlacklist, getBlacklist } from '../../lib/database.js'

let handler = async (m, { command, prefix, targets, RaplyGwe }) => {
    const p = prefix || '.'

    if (command === 'listblacklist') {
        const list = getBlacklist()
        if (!list.length) return RaplyGwe('Blacklist masih kosong.')
        return RaplyGwe(`*Daftar Blacklist* (${list.length})\n\n${list.map((v, i) => `${i + 1}. ${v}`).join('\n')}`)
    }

    const creators = (config.creator || []).map(v => String(v).replace(/[^0-9]/g, ''))
    const list = targets.filter(v => !creators.includes(v.split('@')[0]))
    if (!list.length) return RaplyGwe(`Tag, reply, atau masukkan nomornya.\n\nContoh:\n${p}${command} 628xxxxxxxxxx`)

    const add = command === 'blacklist'
    const done = list.filter(v => add ? addBlacklist(v) : delBlacklist(v))
    if (!done.length) return RaplyGwe(add ? 'Nomor itu sudah ada di blacklist.' : 'Nomor itu tidak ada di blacklist.')

    await RaplyGwe(`${done.length} nomor berhasil ${add ? 'diblacklist' : 'dihapus dari blacklist'}.`)
}

handler.help = ['blacklist <nomor>', 'delblacklist <nomor>', 'listblacklist']
handler.tags = ['owner']
handler.command = /^(blacklist|delblacklist|listblacklist)$/i
handler.owner = true

export default handler
