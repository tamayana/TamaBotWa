import axios from 'axios'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@adiwajshing/baileys'

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let quotedMsg = m.msg?.contextInfo?.quotedMessage || m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null
        let stanzaId = m.msg?.contextInfo?.stanzaId || m.message?.extendedTextMessage?.contextInfo?.stanzaId || null
        if (!quotedMsg && !m.msg?.mimetype && !q?.mimetype) return m.reply(`Reply foto/video nya, lalu ketik *${usedPrefix + command}*`)
        await m.reply('⏳ Sedang mengunggah ke Catbox...')
        let buffer = null
        let mime = ''
        if (stanzaId && global.viewOnceCache?.has(stanzaId)) {
            let saved = global.viewOnceCache.get(stanzaId)
            buffer = saved.buffer
            mime = saved.mimetype
            console.log('✅ tourl ambil dari cache:', stanzaId)
        }
        if (!buffer && q && typeof q.download === 'function') {
            try { buffer = await q.download(); mime = q.mimetype || mime } catch (e) {}
        }
        if (!buffer) {
            try { buffer = await conn.downloadMediaMessage(q?.fakeObj || q || m) } catch (e) {}
        }
        if (!buffer && quotedMsg) {
            try {
                let inner = quotedMsg.viewOnceMessageV2?.message || quotedMsg.viewOnceMessage?.message || quotedMsg.ephemeralMessage?.message?.viewOnceMessageV2?.message || quotedMsg
                let type = Object.keys(inner || {})[0]
                let content = inner?.[type]
                if (content?.mediaKey) {
                    mime = content.mimetype || mime
                    let mediaType = type.includes('image') ? 'image' : type.includes('video') ? 'video' : 'image'
                    let stream = await downloadContentFromMessage(content, mediaType)
                    let chunks = []
                    for await (let c of stream) chunks.push(c)
                    buffer = Buffer.concat(chunks)
                }
            } catch (e) {}
        }
        if (!buffer) return m.reply('❌ Foto nya belum tersimpan!\nBot harus ON pas foto dikirim!\nKirim ulang foto sekali liat nya, terus LANGSUNG reply -> *.tourl*')
        if (!mime) mime = q?.mimetype || 'image/jpeg'
        let ext = mime.split('/')[1]?.split(';')[0] || 'jpg'
        if (ext === 'jpeg') ext = 'jpg'
        let filename = `TamaBot_${Math.random().toString(36).substring(2, 8)}.${ext}`
        let form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', buffer, { filename })
        let res = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders() },
            maxBodyLength: Infinity, maxContentLength: Infinity, timeout: 60000,
            validateStatus: () => true
        })
        let url = typeof res.data === 'string' ? res.data.trim() : ''
        if (!url.startsWith('https://')) return m.reply('❌ Gagal upload ke Catbox!')
        return m.reply(`✅ *BERHASIL!*\n\n🔗 *Link:* ${url}\n📦 *Server:* Catbox\n📁 *Tipe:* ${mime}`)
    } catch (e) {
        console.error(e)
        return m.reply(`❌ Error: ${e.message}`)
    }
}
handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl)$/i
export default handler
