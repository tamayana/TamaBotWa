import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

let handler = async (m, { conn, RaplyGwe }) => {
    const code = await conn.groupInviteCode(m.chat).catch(() => null)
    if (!code) return RaplyGwe('Gagal mengambil link grup. Pastikan bot sudah jadi Admin.')

    const link = `https://chat.whatsapp.com/${code}`
    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessageV2Extension: {
            message: {
                messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text: `* *Link Grup :*\n${link}` },
                    nativeFlowMessage: {
                        buttons: [{
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Copy Link Grup',
                                id: 'copy_link',
                                copy_code: link
                            })
                        }]
                    }
                })
            }
        }
    }, { userJid: conn.user.id, quoted: m })

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
}

handler.help = ['linkgc']
handler.tags = ['group']
handler.command = /^(linkgc|linkgrup)$/i
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler
