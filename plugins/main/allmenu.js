import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import sharp from 'sharp'
import config from '../../config.js'
import { runtime } from '../../lib/myfunc.js'
import { plugins } from '../../handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const thumbPath = path.join(__dirname, '../../media/thumb.jpg')
const soundPath = path.join(__dirname, '../../media/sound.mp3')

let handler = async (m, { conn }) => {
    const total = new Set(plugins.values()).size
    
    let thumb = await sharp(thumbPath)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer()

    let kat = {}
    for (let p of new Set(plugins.values())) {
        let tags = [].concat(p?.tags ?? [])
            .filter(v => typeof v === 'string' && v.trim() !== '')
            .map(v => v.trim())
        if (!tags.length) continue

        let help = [].concat(p?.help ?? [])
            .filter(v => typeof v === 'string' && v.trim() !== '')
            .map(v => v.trim())
        if (!help.length) continue

        for (let tag of tags) {
            let t = tag.charAt(0).toUpperCase() + tag.slice(1)
            kat[t] ??= []
            for (let h of help) {
                if (!kat[t].includes(h)) kat[t].push(h)
            }
        }
    }

    let list = ''
    let pref = config.prefix[0] || '.'
    let urut = Object.keys(kat).sort()

    for (let nama of urut) {
        list += `□ ./${nama}.js\n└────────\n`
        for (let h of kat[nama].sort()) {
            let noPrefix = /^[^a-z0-9]/i.test(h)
            list += `│ ├─ ${noPrefix ? '' : pref}${h}\n`
        }
        list += `│ └────────\n\n`
    }
    
    let msg = `👋 𝖧𝖾𝗅𝗈, 𝖶𝖾𝗅𝖼𝗈𝗆𝖾`
    
    let anu = `◜🔔◞ *./𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.𝗃𝗌*
└╼ *𝖢𝗋𝖾𝖺𝗍𝗈𝗋:* wa.me/6285393659857
└╼ *𝖵𝖾𝗋𝗌𝗂𝗈𝗇:* 𝟥.𝟢𝟢
└╼ *𝖱𝗎𝗇 𝖳𝗂𝗆𝖾:* ${runtime(process.uptime())}

${list}`

    // 1. MUSIK DULU BUNG!
    try {
        await conn.sendMessage(m.chat, {
            audio: { url: soundPath },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: m })
    } catch (e) {
        console.log('Gagal kirim musik:', e)
    }

    // 2. MENU + FOTO JADI SATU BUNG! PETA NYA UDAH GUA HAPUS!
    // Atas nya langsung foto TAMA lu, bukan peta item lagi!
    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(thumbPath),
        caption: `${msg}\n\n${anu}`,
        footer: '© Rahmad-Pratama',
        buttons: [
            {
                buttonId: '.menu',
                buttonText: { displayText: 'back' },
                type: 1
            }
        ],
        headerType: 4
    }, { quoted: m })
}

handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^(allmenu|all)$/i

export default handler
