import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

let handler = async (m, { conn, text, args }) => {
    let input = text || args[0]
    if (!input) return m.reply("Kirim link grup atau kode undangan grup.")

    let kode = input.includes('chat.whatsapp.com/') 
        ? input.split('chat.whatsapp.com/')[1]?.split(/[/?\s]/)[0]
        : input.trim()

    let res = await conn.groupGetInviteInfo(kode).catch(() => null)
    if (!res) return m.reply("Gagal mengambil info grup. Pastikan link atau kode undangan valid.")

    let nama = res.subject || "-"
    let idgc = res.id || "-"
    let member = res.size || res.participants?.length || "-"
    
    let tgl = res.creation 
        ? new Date(res.creation * 1000).toLocaleDateString('id-ID', {
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        }) 
        : "-"

    let teks = `
* *Nama Grup :* ${nama}
* *ID Grup :* ${idgc}
* *Total Member :* ${member}
* *Dibuat Pada :* ${tgl}`

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
                                display_text: "Copy ID Grup",
                                id: "copy_id",
                                copy_code: idgc
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

handler.help = ['idgc']
handler.tags = ['group']
handler.command = /^(idgc|infogc)$/i

export default handler