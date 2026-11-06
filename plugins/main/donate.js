import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@adiwajshing/baileys'
import config from '../../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const qrisPath = path.join(__dirname, '../../media/qris.jpg')

let handler = async (m, { conn }) => {
    const pushname = m.pushName || 'Kak'

    const sc = `Halo *${pushname}*, terima kasih telah menggunakan layanan bot ini. Apakah Anda ingin memberikan dukungan untuk pengembangannya?`

    const anu = `
Dukungan dan donasi yang Anda berikan sangat berarti bagi kami. Kontribusi tersebut akan dialokasikan sepenuhnya untuk keberlangsungan server, pemeliharaan sistem, serta pengembangan fitur-fitur baru agar bot ini dapat terus beroperasi secara optimal dan memberikan pelayanan terbaik bagi seluruh pengguna.

Setiap donasi yang masuk akan dikelola secara transparan. Jika Anda telah menyelesaikan pembayaran melalui kode QRIS di atas, mohon untuk menekan tombol konfirmasi di bawah ini agar dapat segera kami verifikasi dan masukkan ke dalam daftar donatur resmi kami.
`.trim()

    try {
        const thumb = await sharp(qrisPath).resize(400, 400).jpeg({ quality: 80 }).toBuffer()

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
                                        display_text: 'Support kami',
                                        url: 'https://www.tiktok.com/@mctama',
                                        merchant_url: 'https://www.tiktok.com/@mctama'
                                    })
                                }
                            ]
                        }),
                        contextInfo: {
                            forwardingScore: 9,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluranId, 
                                newsletterName: config.saluranName, 
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
        await conn.sendMessage(m.chat, { text: `❌ Gagal memuat menu donasi: ${e.message}` }, { quoted: m })
    }
}

handler.help = ['donate', 'donasi']
handler.tags = ['main']
handler.command = /^(donate|donasi)$/i

export default handler
