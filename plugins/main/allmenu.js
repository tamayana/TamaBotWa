import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'
import config from '../../config.js'
import { runtime } from '../../lib/myfunc.js'
import { plugins } from '../../handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const thumbPath = path.join(__dirname, '../../media/thumb.jpg')

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
    
    let msg = `\`👋 𝖧𝖾𝗅𝗈, 𝖶𝖾𝗅𝖼𝗈𝗆𝖾\``
    
    let anu = `◜🔔◞ *./𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.𝗃𝗌*
└╼ *𝖢𝗋𝖾𝖺𝗍𝗈𝗋:* t.me/FyzzModss
└╼ *𝖵𝖾𝗋𝗌𝗂𝗈𝗇:* 𝟥.𝟢𝟢
└╼ *𝖱𝗎𝗇 𝖳𝗂𝗆𝖾:* ${runtime(process.uptime())}

${list}`

    const waMsg = generateWAMessageFromContent(m.chat, {
        buttonsMessage: {
            locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: config.botName,
                address: `𝖸𝗈𝗋𝗎𝗆𝗂-𝖬𝖣`,
                jpegThumbnail: thumb
            },
            contentText: msg,
            footerText: anu,
            buttons: [
                {
                    buttonId: '.menu',
                    buttonText: { displayText: 'back' },
                    type: 1
                }
            ],
            headerType: 6
        }
    }, {
        userJid: conn.user.id,
        quoted: m,
        messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
    })

    await conn.relayMessage(m.chat, waMsg.message, {
        messageId: waMsg.key.id,
        additionalNodes: [
            {
                tag: 'biz',
                attrs: {},
                content: [
                    {
                        tag: 'interactive',
                        attrs: { type: 'native_flow', v: '1' },
                        content: [
                            { tag: 'native_flow', attrs: { v: '9', name: 'mixed' }, content: [] }
                        ]
                    }
                ]
            }
        ]
    })
}

handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^(allmenu|all)$/i

export default handler
