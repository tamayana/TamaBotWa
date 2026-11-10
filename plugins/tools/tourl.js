import axios from 'axios'
import FormData from 'form-data'
import { proto, generateWAMessageFromContent } from '@adiwajshing/baileys'

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
    try {
        const form = new FormData()
        form.append('files[]', buffer, { filename })
        const res = await axios.post('https://pone.rs/upload.php', form, {
            headers: {
                ...form.getHeaders(),
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
                accept: '*/*',
                origin: 'https://pone.rs',
                referer: 'https://pone.rs/'
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true,
            timeout: 60000
        })
        const url = res.data?.files?.[0]?.url?.replaceAll('\\/', '/') || null
        return url
    } catch { return null }
}

async function upCatbox(buffer, filename) {
    try {
        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', buffer, { filename })
        const res = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders() },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true,
            timeout: 60000
        })
        const url = typeof res.data === 'string' && res.data.startsWith('https://') ? res.data.trim() : null
        return url
    } catch { return null }
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

    // Coba pone dulu, kalo gagal pindah ke catbox
    let url = await upPone(buffer, filename)
    let provider = 'pone.rs'
    if (!url) {
        url = await upCatbox(buffer, filename)
        provider = 'catbox.moe'
    }
    if (!url) return m.reply('Gagal mengunggah ke server. Coba lagi nanti, server upload lagi down.')

    // INI YANG GUA BENERIN BUNG! TADI PAKE ' ' JADI ${url} GAK KE BACA!
    // SEKARANG PAKE ` ` BIAR URL NYA MUNCUL!
    let teks = `Berhasil diunggah!\n*URL:* ${url}\n*Server:* ${provider}`

    try {
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
    } catch {
        // Kalo tombol copy gagal di WA baru, kirim teks biasa aja biar tetep jalan
        await m.reply(teks)
    }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl)$/i

export default handler
