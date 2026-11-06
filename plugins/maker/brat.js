import axios from 'axios'
import config from '../../config.js'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    text = text || m.quoted?.text || ''
    if (!text.trim()) return RaplyGwe(`Masukkan teks!\nContoh: *${usedPrefix + command}* Halo dunia`)

    await m.react('🕒')

    try {
        let { data, headers, status } = await axios.get('https://api.kyzzz.xyz/api/maker/brat', {
            params: { text: text.trim(), theme: 'white', apikey: 'kyzz211554828' },
            responseType: 'arraybuffer',
            timeout: 60000,
            validateStatus: () => true
        })

        if (status !== 200 || !/^image\//i.test(headers['content-type'] || '')) {
            throw new Error(`API status ${status}: ${Buffer.from(data).toString('utf-8', 0, 150).trim()}`)
        }

        await conn.sendSticker(m.chat, Buffer.from(data), m, {
            packname: global.stickpack || global.namebot || config.botName,
            author: global.stickauth || global.author || config.ownerName
        })

        await m.react('✅')
    } catch (e) {
        console.error('[brat]', e)
        await m.react('❌')
        await RaplyGwe(`Gagal membuat stiker.\n\n${e.message}`.slice(0, 600))
    }
}

handler.help = ['brat <teks>']
handler.tags = ['maker']
handler.command = /^(brat)$/i

export default handler
