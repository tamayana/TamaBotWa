import axios from 'axios'
import FormData from 'form-data'
import { proto, generateWAMessageFromContent } from '@adiwajshing/baileys'

function getExt(mime = '') {
    if (mime.includes('image/jpeg')) return '.jpg'
    if (mime.includes('image/png')) return '.png'
    if (mime.includes('image/webp')) return '.webp'
    if (mime.includes('video/mp4')) return '.mp4'
    if (mime.includes('audio/mpeg')) return '.mp3'
    if (mime.includes('application/pdf')) return '.pdf'
    return '.bin'
}

async function upCatbox(buffer, filename) {
    try {
        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', buffer, { filename })
        const res = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders() },
            timeout: 20000, // 20 DETIK AJA, JANGAN 60!
            validateStatus: () => true
        })
        const url = typeof res.data === 'string' && res.data.startsWith('https://') ? res.data.trim() : null
        return url
    } catch { return null }
}

async function upPone(buffer, filename) {
    try {
        const form = new FormData()
        form.append('files[]', buffer, { filename })
        const res = await axios.post('https://pone.rs/upload.php', form, {
            headers: { ...form.getHeaders(), 'user-agent': 'Mozilla/5.0' },
            timeout: 20000,
            validateStatus: () => true
        })
        return res.data?.files?.[0]?.url?.replaceAll('\\/', '/') || null
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

    // CATBOX DULU YANG CEPET, KALO GAGAL BARU PONE!
    let url = await upCatbox(buffer, filename)
    let provider = 'catbox.moe'
    if (!url) {
        url = await upPone(buffer, filename)
        provider = 'pone.rs'
    }
    if (!url) return m.reply('Gagal mengunggah ke server. Coba lagi nanti, server upload lagi down.')

    let teks = `Berhasil diunggah!\n*URL:* ${url}\n*Server:* ${provider}`
    try {
        let msgii = await generateWAMessageFromContent(m.chat, {
            viewOnceMessageV2Extension: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: { text: teks },
                        nativeFlowMessage: {
                            buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copy', id: 'copy_url', copy_code: url }) }]
                        }
                    })
                }
            }
        }, { userJid: conn.user.id, quoted: m })
        await conn.relayMessage(m.chat, msgii.message, { messageId: msgii.key.id, additionalNodes: [{ tag: 'biz', attrs: {}, content: [{ tag: 'interactive', attrs: { type: 'native_flow', v: '1' }, content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' }, content: [] }] }] }] })
    } catch {
        await m.reply(teks)
    }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl)$/i
export default handler
