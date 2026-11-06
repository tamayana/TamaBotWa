import axios from 'axios'
import FormData from 'form-data'
import { proto, generateWAMessageFromContent } from '@adiwajshing/baileys'

const API = 'https://pone.rs/upload.php'

function getExt(mime = '') {
    if (mime.includes('image/jpeg')) return '.jpg'
    if (mime.includes('image/png')) return '.png'
    if (mime.includes('image/webp')) return '.webp'
    if (mime.includes('image/gif')) return '.gif'
    if (mime.includes('video/mp4')) return '.mp4'
    if (mime.includes('video/webm')) return '.webm'
    if (mime.includes('audio/mpeg')) return '.mp3'
    if (mime.includes('audio/ogg')) return '.ogg'
    if (mime.includes('audio/mp4')) return '.m4a'
    if (mime.includes('application/pdf')) return '.pdf'
    if (mime.includes('application/zip')) return '.zip'
    return '.bin'
}

async function upPone(buffer, filename) {
    const form = new FormData()
    form.append('files[]', buffer, { filename })

    try {
        const res = await axios.post(API, form, {
            headers: {
                ...form.getHeaders(),
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
                accept: '*/*',
                origin: 'https://pone.rs',
                referer: 'https://pone.rs/'
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true
        })

        const data = res.data
        const url = data?.files?.[0]?.url?.replaceAll('\\/', '/') || null
        return url
    } catch (err) {
        return null
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) return m.reply(`Reply media atau kirim media dengan caption *${usedPrefix + command}*`)

    m.reply('Sedang mengunggah, tunggu sebentar...')

    let buffer = await q.download()
    if (!buffer) return m.reply('Gagal mendownload media.')

    let ext = getExt(mime)
    let filename = Math.random().toString(36).substring(2, 8) + ext

    let url = await upPone(buffer, filename)
    if (!url) return m.reply('Gagal mengunggah ke server.')

    let teks = '```Berhasil diunggah!```\n*URL:* ${url}'

    let msgii = await generateWAMessageFromContent(m.chat, {
        viewOnceMessageV2Extension: {
            message: {
                messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [{
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Copy',
                                id: 'copy_url',
                                copy_code: url
                            })
                        }]
                    }
                })
            }
        }
    }, { userJid: conn.user.id, quoted: m })

    await conn.relayMessage(m.chat, msgii.message, {
        messageId: msgii.key.id,
        additionalNodes: [{
            tag: 'biz',
            attrs: {},
            content: [{
                tag: 'interactive',
                attrs: { type: 'native_flow', v: '1' },
                content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' }, content: [] }]
            }]
        }]
    })
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl)$/i

export default handler