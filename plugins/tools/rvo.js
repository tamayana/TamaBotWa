import { downloadContentFromMessage } from '@adiwajshing/baileys'

let handler = async (m, { conn, RaplyGwe }) => {
    let reply = RaplyGwe || m.reply
    if (!m.quoted) return reply('Reply foto / video sekali liat nya! Contoh: reply foto sekali liat terus ketik *.rvo*')
    try {
        let q = m.quoted
        let quotedMsg = m.msg?.contextInfo?.quotedMessage || m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null
        let stanzaId = m.msg?.contextInfo?.stanzaId || m.message?.extendedTextMessage?.contextInfo?.stanzaId || null

        let buffer = null
        let type = 'image'
        let mime = ''

        // CARA 0: AMBIL DARI SIMPANAN index.js! BISA WALAU UDAH DIBUKA!
        if (stanzaId && global.viewOnceCache?.has(stanzaId)) {
            let saved = global.viewOnceCache.get(stanzaId)
            buffer = saved.buffer
            mime = saved.mimetype || ''
            type = mime.includes('video') ? 'video' : 'image'
            console.log('✅ rvo ambil dari cache:', stanzaId)
        }

        // CARA 1: Pake q.download() dari smsg
        if (!buffer && q && typeof q.download === 'function') {
            try {
                buffer = await q.download()
                mime = q.mimetype || q.msg?.mimetype || ''
                type = mime.includes('video') ? 'video' : 'image'
            } catch (e) {}
        }

        // CARA 2: Manual downloadContentFromMessage (Kalo belum dibuka)
        if (!buffer && quotedMsg) {
            try {
                let inner = quotedMsg.viewOnceMessageV2?.message || quotedMsg.viewOnceMessage?.message || quotedMsg.ephemeralMessage?.message?.viewOnceMessageV2?.message || quotedMsg
                let t = Object.keys(inner || {})[0]
                let content = inner?.[t]
                if (content?.mediaKey) {
                    mime = content.mimetype || ''
                    type = t.includes('video') || mime.includes('video') ? 'video' : 'image'
                    let stream = await downloadContentFromMessage(content, type)
                    let chunks = []
                    for await (let c of stream) chunks.push(c)
                    buffer = Buffer.concat(chunks)
                }
            } catch (e) {}
        }

        if (!buffer || !buffer.length) return reply('Gagal buka! Foto nya belum tersimpan!\nBot harus ON pas foto nya dikirim!\nKirim ulang foto sekali liat nya, terus LANGSUNG reply -> *.rvo*')

        if (type === 'image') await conn.sendMessage(m.chat, { image: buffer, caption: '✅ Nih foto sekali liat nya!' }, { quoted: m })
        else await conn.sendMessage(m.chat, { video: buffer, caption: '✅ Nih video sekali liat nya!' }, { quoted: m })
    } catch (e) {
        console.error('ERROR rvo:', e)
        return (RaplyGwe || m.reply)('Gagal buka RVO! Coba kirim ulang foto sekali liat nya terus langsung *.rvo*')
    }
}

handler.help = ['rvo']
handler.tags = ['tools']
handler.command = /^(rvo|readviewonce)$/i

export default handler
