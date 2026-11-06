import path from 'path'
import axios from 'axios'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@adiwajshing/baileys'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const args = (text || '').trim().split(/\s+/).filter(Boolean)
    const perPage = 10

    if (!args.length) {
        return RaplyGwe(`Masukkan nama kota, kecamatan, atau desa.\n\nContoh:\n${usedPrefix + command} Bandung\n${usedPrefix + command} Bandung 2`)
    }

    const page = args.length > 1 && /^\d+$/.test(args[args.length - 1])
        ? Math.max(1, parseInt(args.pop(), 10))
        : 1
    const keyword = args.join(' ')

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const { data } = await axios.get('https://api.kyzzz.xyz/api/tools/kodepost', {
            params: { kota: keyword, apikey: 'kyzz211554828' },
            timeout: 30000
        })

        const list = Array.isArray(data?.result) ? data.result : []
        if (!data?.status || !list.length) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return RaplyGwe(`Kode pos untuk *${keyword}* tidak ditemukan.`)
        }

        const totalPage = Math.ceil(list.length / perPage)
        if (page > totalPage) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return RaplyGwe(`Halaman ${page} tidak ada. Total halaman: *${totalPage}*`)
        }

        const items = list.slice((page - 1) * perPage, page * perPage)
        const title = `\`KODE POS ${keyword.toUpperCase()}\``
        const info  = `└▢ *Halaman:* ${page}/${totalPage} ─ ${list.length} hasil`
        const next  = page < totalPage
            ? `\n> ⁉️ Ketik: *${usedPrefix + command} ${keyword} ${page + 1}* halaman berikutnya.`
            : ''

        try {
            const thumb = await sharp(path.join(__dirname, '../../media/thumb.jpg'))
                .resize(300, 300)
                .jpeg({ quality: 80 })
                .toBuffer()

            const media = await prepareWAMessageMedia(
                { image: thumb, mimetype: 'image/jpeg' },
                { upload: conn.waUploadToServer }
            )

            const cards = items.map(item => ({
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage
                }),
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `*${item.kodepos}*`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏʀᴜᴍɪ-ᴍᴅ` }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: 'Salin Code',
                            id: 'copy_kodepos',
                            copy_code: String(item.kodepos)
                        })
                    }]
                })
            }))

            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.fromObject({
                                text: `*${title}*\n${info}${next}`
                            }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
                        })
                    }
                }
            }, { userJid: m.sender, quoted: m })

            await conn.relayMessage(m.chat, msg.message, {
                messageId: msg.key.id,
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
        } catch (e) {
            console.error('[kodepos] carousel gagal, kirim teks biasa', e)
            const lines = items.map((item, i) => {
                const num = (page - 1) * perPage + i + 1
                return `${num}. ${item.desa}, ${item.kecamatan}\n   ${item.kota}, ${item.provinsi}\n   Kode Pos: *${item.kodepos}*`
            })
            await RaplyGwe(`*${title}*\n${info}\n\n${lines.join('\n\n')}${next}`)
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        console.error('[kodepos]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.message || 'Terjadi kesalahan.'}`)
    }
}

handler.help = ['kodepos <kota>']
handler.tags = ['search']
handler.command = /^(kodepos|kodepost)$/i

export default handler
