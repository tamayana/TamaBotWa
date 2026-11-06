import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command}* Apa itu JavaScript?`)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const { data } = await axios.get(`https://api.ikyyxd.my.id/ai/gemini?text=${encodeURIComponent(text)}`, { timeout: 30000 })
        let reply = data.result || data.message || data.data || (typeof data === 'string' ? data : JSON.stringify(data))
        
        if (!reply) throw new Error('Respon kosong dari API.')

        let xmsg = {
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 1,
                        submessages: [
                            {
                                messageType: 5,
                                codeMetadata: {
                                    codeLanguage: "javascript",
                                    codeBlocks: [
                                        {
                                            highlightType: 3,
                                            codeContent: reply
                                        }
                                    ]
                                }
                            }
                        ],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: '0@bot' },
                            forwardOrigin: 4
                        }
                    }
                }
            }
        }
        
        await conn.relayMessage(m.chat, xmsg, {
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
        })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.message}`)
    }
}

handler.command = /^(gemini)$/i
handler.tags = ['ai']
handler.help = ['gemini <pertanyaan>']

export default handler
