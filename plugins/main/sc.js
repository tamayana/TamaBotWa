import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@adiwajshing/baileys'
import config from '../../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const thumbPath = path.join(__dirname, '../../media/thumb.jpg')

let handler = async (m, { conn }) => {
    const pushname = m.pushName || 'No Name'

    const sc = `> *halo ${pushname}, apakah kamu menginginkan script ini?*`

    const anu = `
jika kamu menginginkan script ini silahkan klik tombol di bawah ini

\`rulles\`
- dilarang keras menghapus credits minimal taro di tqto
- dilarang memperjual belikan script ini karena 100% free
- dilarang mengklaim script ini 100%
`.trim()

    try {
        const thumb = await sharp(thumbPath).resize(300, 300).jpeg({ quality: 80 }).toBuffer()

        const media = await prepareWAMessageMedia(
            { image: thumb, mimetype: 'image/jpeg' },
            { upload: conn.waUploadToServer }
        )

        const msgii = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: sc },
                        footer: { text: anu },
                        header: {
                            hasMediaAttachment: true,
                            imageMessage: media.imageMessage
                        },
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Get Script',
                                        url: 'https://wa.me/6285393659857',
                                        merchant_url: 'https://wa.me/6285393659857'
                                    })
                                },
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Web Store',
                                        url: 'https://wa.me/6285393659857',
                                        merchant_url: 'https://wa.me/6285393659857'
                                    })
                                }
                            ]
                        }),
                        contextInfo: {
                            forwardingScore: 9,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluranId || '120363431048748349@newsletter',
                                newsletterName: config.saluranName || 'MCTama',
                                serverMessageId: 127
                            }
                        }
                    })
                }
            }
        }, { userJid: m.chat, upload: conn.waUploadToServer, quoted: m })
        
        await conn.relayMessage(m.chat, msgii.message, {
            messageId: msgii.key.id,
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

    } catch (e) {
        await conn.sendMessage(m.chat, { text: `❌ Gagal kirim pesan: ${e.message}` }, { quoted: m })
    }
}

handler.help = ['sc']
handler.tags = ['main']
handler.command = /^(sc|script|getsc)$/i

export default handler
