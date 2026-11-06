import config from '../../config.js'
import { runtime, tanggal } from '../../lib/myfunc.js'
import { plugins } from '../../handler.js'

let handler = async (m, { conn }) => {
    const pushname = m.pushName || 'No Name'
    const date = tanggal(Date.now())
    const total = new Set(plugins.values()).size

    const anu = `👋 𝖧𝖾𝗅𝗈, 𝖶𝖾𝗅𝖼𝗈𝗆𝖾
𝖯𝖾𝗋𝗄𝖾𝗇𝖺𝗅𝗄𝖺𝗇 𝗇𝖺𝗆𝖺 𝗌𝖺𝗒𝖺 \`${config.botName}\`, 𝖺𝗌𝗂𝗌𝗍𝖾𝗇 𝖶𝗁𝖺𝗍𝗌𝖠𝗉𝗉 𝗒𝖺𝗇𝗀 𝗌𝗂𝖺𝗉 𝗆𝖾𝗆𝖻𝖺𝗇𝗍𝗎 𝗄𝖺𝗆𝗎 𝗄𝖺𝗉𝖺𝗇 𝗌𝖺𝗃𝖺.

◜🔔◞ *./𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.𝗃𝗌*
└╼ *𝖢𝗋𝖾𝖺𝗍𝗈𝗋:* wa.me/6285393659857
└╼ *𝖵𝖾𝗋𝗌𝗂𝗈𝗇:* 𝟥.𝟢𝟢
└╼ *𝖳𝗈𝗍𝖺𝗅 𝖥𝗂𝗍𝗎𝗋:* ${total} fitur
└╼ *𝖬𝗈𝖽𝖾:* ${config.botMode === 'public' ? '*Public*' : '*Self*'}
└╼ *𝖱𝗎𝗇 𝖳𝗂𝗆𝖾:* ${runtime(process.uptime())}

◜⁉️◞ *./𝖴𝗌𝖾𝗋_𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.𝗃𝗌*
└╼ *𝗇𝖺𝗆𝖾:* ${pushname}
└╼ *𝗌𝗍𝖺𝗍𝗎𝗌:* ${m.isCreator ? '*👑 Owner*' : m.isPremium ? '*💎 Premium*' : '*🫪 User Free*'}

> 𝗢𝗿𝗱𝗲𝗿 𝗣𝗮𝗻𝗲𝗹 𝗟𝗲𝗴𝗮𝗹!!
📎 https://wa.me/6285393659857

© Rahmad-Pratama`

    await conn.sendMessage(m.chat, {
        text: anu,
        contextInfo: {
            forwardingScore: 9,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluranId,
                newsletterName: config.saluranName,
                serverMessageId: 127
            }
        }
    }, { quoted: m })
}

handler.tags = ['main']
handler.command = /^(menu|help|h)$/i

export default handler
