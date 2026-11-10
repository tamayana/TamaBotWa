import { downloadContentFromMessage } from '@adiwajshing/baileys'

let handler = async (m, { conn, RaplyGwe }) => {
    if (!m.quoted) return RaplyGwe('Reply foto / video sekali liat nya! Contoh: reply foto sekali liat terus ketik *.rvo*')
    try {
        let q = m.quoted
        let mime = q.mtype || ''
        if (!/image|video/.test(mime)) return RaplyGwe('Ini bukan foto / video sekali liat!')
        let type = mime.includes('image') ? 'image' : 'video'
        let stream = await downloadContentFromMessage(q.msg, type)
        let chunks = []
        for await (let c of stream) chunks.push(c)
        let buffer = Buffer.concat(chunks)
        if (!buffer.length) return RaplyGwe('Gagal buka! Foto nya udah kehapus / udah lewat 10 menit!')
        if (type === 'image') await conn.sendMessage(m.chat, { image: buffer, caption: '✅ Nih foto sekali liat nya!' }, { quoted: m })
        else await conn.sendMessage(m.chat, { video: buffer, caption: '✅ Nih video sekali liat nya!' }, { quoted: m })
    } catch (e) {
        return RaplyGwe('Gagal buka RVO! Coba kirim ulang foto sekali liat nya terus langsung *.rvo* jangan nunggu lama!')
    }
}

handler.help = ['rvo']
handler.tags = ['tools']
handler.command = /^(rvo|readviewonce)$/i

export default handler
