import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const premPath = path.join(__dirname, '../../database/premium.json')

let handler = async (m, { args, RaplyGwe }) => {
    if (!args[0]) return RaplyGwe('Contoh:\n.delprem 628xxx')

    const number = args[0].replace(/[^0-9]/g, '')
    const target = number + '@s.whatsapp.net'

    const premium = JSON.parse(fs.readFileSync(premPath, 'utf8'))
    const idx = premium.indexOf(target)
    if (idx === -1) return RaplyGwe(`${target} bukan Premium.`)

    premium.splice(idx, 1)
    fs.writeFileSync(premPath, JSON.stringify(premium, null, 2))
    await RaplyGwe(`✅ ${target} sudah bukan Premium.`)
}

handler.help = ['delprem <nomor>']
handler.tags = ['owner']
handler.command = /^(delprem|delpremium)$/i
handler.creator = true

export default handler