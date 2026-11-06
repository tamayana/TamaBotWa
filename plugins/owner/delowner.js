import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ownerPath = path.join(__dirname, '../../database/owner.json')

let handler = async (m, { args, RaplyGwe }) => {
    if (!args[0]) return RaplyGwe('Contoh:\n.delowner 628xxx')

    const number = args[0].replace(/[^0-9]/g, '')
    const target = number + '@s.whatsapp.net'

    const owner = JSON.parse(fs.readFileSync(ownerPath, 'utf8'))
    const idx = owner.indexOf(target)
    if (idx === -1) return RaplyGwe(`${target} bukan Owner.`)

    owner.splice(idx, 1)
    fs.writeFileSync(ownerPath, JSON.stringify(owner, null, 2))
    await RaplyGwe(`✅ ${target} sudah bukan Owner.`)
}

handler.help = ['delowner <nomor>']
handler.tags = ['owner']
handler.command = /^(delowner|delown)$/i
handler.creator = true

export default handler