import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

let handler = async (m, { conn, text }) => {
    let jid = m.quoted?.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid || m.msg?.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid
    let kode = jid

    if (!kode && text) {
        if (text.includes('whatsapp.com/channel/')) {
            kode = text.split('whatsapp.com/channel/')[1]?.split(/[/?\s]/)[0]
        } else if (text.includes('@newsletter')) {
            kode = text.trim()
        }
    }

    if (!kode) return m.reply("Kirim link channel atau balas pesan dari channel buat cek ID.")

    let isInvite = !kode.includes('@newsletter')
    let res = await conn.newsletterMetadata(isInvite ? "invite" : "jid", kode).catch(() => null)
    
    if (!res) return m.reply("Channel tidak ditemukan")

    let th = res.thread_metadata || {}
    let nama = res.name?.text || res.name || th.name?.text || "-"
    let foll = res.subscribers || th.subscribers_count || "-"
    let status = res.state?.type || res.state || th.state?.type || "-"
    let verif = (res.verification || th.verification) == "VERIFIED" ? "Terverifikasi" : "Tidak"

    let teks = `
* *ID :* ${res.id}
* *Nama :* ${nama}
* *Total Pengikut :* ${foll}
* *Status :* ${status}
* *Verified :* ${verif}`

    let msgii = await generateWAMessageFromContent(m.chat, {
        viewOnceMessageV2Extension: {
            message: {
                messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Copy ID Channel",
                                id: "copy_id",
                                copy_code: res.id
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
            tag: "biz",
            attrs: {},
            content: [{
                tag: "interactive",
                attrs: { type: "native_flow", v: "1" },
                content: [{ tag: "native_flow", attrs: { v: "9", name: "mixed" }, content: [] }]
            }]
        }]
    })
}

handler.help = ['cekidch <link>']
handler.tags = ['tools']
handler.command = /^(cekidch|idch)$/i

export default handler