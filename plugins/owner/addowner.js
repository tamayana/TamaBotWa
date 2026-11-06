import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ownerPath = path.join(__dirname, '../../database/owner.json')

let handler = async (m, { args, conn, RaplyGwe }) => {
    if (!args[0]) return RaplyGwe('Contoh:\n.addowner 628xxx')

    const number = args[0].replace(/[^0-9]/g, '')
    const target = number + '@s.whatsapp.net'

    const cek = await conn.onWhatsApp(target).catch(() => [])
    if (!cek.length) return RaplyGwe('Nomor tidak valid / tidak terdaftar di WhatsApp.')

    const owner = JSON.parse(fs.readFileSync(ownerPath, 'utf8'))
    if (owner.includes(target)) return RaplyGwe(`${target} sudah menjadi Owner.`)

    owner.push(target)
    fs.writeFileSync(ownerPath, JSON.stringify(owner, null, 2))
    await RaplyGwe(`✅ ${target} telah menjadi Owner.`)
}

handler.help = ['addowner <nomor>']
handler.tags = ['owner']
handler.command = /^(addowner|addown)$/i
handler.creator = true

export default handler