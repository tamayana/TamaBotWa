import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const premPath = path.join(__dirname, '../../database/premium.json')

let handler = async (m, { args, conn, RaplyGwe }) => {
    if (!args[0]) return RaplyGwe('Contoh:\n.addprem 628xxx')

    const number = args[0].replace(/[^0-9]/g, '')
    const target = number + '@s.whatsapp.net'

    const cek = await conn.onWhatsApp(target).catch(() => [])
    if (!cek.length) return RaplyGwe('Nomor tidak valid / tidak terdaftar di WhatsApp.')

    const premium = JSON.parse(fs.readFileSync(premPath, 'utf8'))
    if (premium.includes(target)) return RaplyGwe(`${target} sudah menjadi Premium.`)

    premium.push(target)
    fs.writeFileSync(premPath, JSON.stringify(premium, null, 2))
    await RaplyGwe(`✅ ${target} telah menjadi Premium.`)
}

handler.help = ['addprem <nomor>']
handler.tags = ['owner']
handler.command = /^(addprem|addpremium)$/i
handler.creator = true

export default handler