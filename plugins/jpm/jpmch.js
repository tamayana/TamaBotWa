import { getBinaryNodeChildren, downloadContentFromMessage } from '@adiwajshing/baileys'
import config from '../../config.js'
import { sleep } from '../../lib/myfunc.js'

let handler = async (m, { conn, command, prefix, RaplyGwe }) => {
    if (command === 'stopjpmch') {
        if (!global.jpmchRunning) return RaplyGwe('Tidak ada proses jpmch yang sedang berjalan.')
        global.jpmchStop = true
        return RaplyGwe('Permintaan berhenti diterima, jpmch akan berhenti setelah pesan yang sedang dikirim.')
    }

    if (global.jpmchRunning) {
        return RaplyGwe(`jpmch masih berjalan.\nKetik *.stopjpmch* untuk menghentikan.`)
    }

    let teks = (m.text || '').replace(/^\S+\s*/, '').trim()
    let mediaBuffer = null

    if (!teks && m.quoted) {
        teks = (m.quoted.text || '').trim()
    }

    const mediaMsg = m.quoted ? m.quoted.msg : m.msg
    const mediaType = { imageMessage: 'image', videoMessage: 'video', audioMessage: 'audio' }[m.quoted ? m.quoted.mtype : m.mtype]

    if (!teks && !mediaType) {
        const p = prefix || '.'
        return RaplyGwe(`Contoh:\n${p}jpmch Halo semua\n${p}jpmch (reply teks/gambar/video/audio)`)
    }

    if (mediaType && mediaMsg && typeof mediaMsg === 'object') {
        try {
            const stream = await downloadContentFromMessage(mediaMsg, mediaType)
            const chunks = []
            for await (const chunk of stream) chunks.push(chunk)
            mediaBuffer = Buffer.concat(chunks)
        } catch (err) {
            if (!teks) return RaplyGwe('Gagal mengunduh media, coba kirim ulang.')
        }
    }

    const fetchSubscribedChannels = async (sock) => {
        const data = {}
        const encoder = new TextEncoder()
        const queryIds = ['6388546374527196']

        for (const queryId of queryIds) {
            try {
                if (typeof sock.query !== 'function') {
                    throw new Error('sock.query tidak tersedia')
                }

                const result = await sock.query({
                    tag: 'iq',
                    attrs: {
                        id: sock.generateMessageTag(),
                        type: 'get',
                        xmlns: 'w:mex',
                        to: '@s.whatsapp.net'
                    },
                    content: [
                        {
                            tag: 'query',
                            attrs: { query_id: queryId },
                            content: encoder.encode(JSON.stringify({ variables: {} }))
                        }
                    ]
                })

                const resultNode = getBinaryNodeChildren(result, 'result')[0]
                if (!resultNode?.content) continue

                const raw = typeof resultNode.content === 'string'
                    ? resultNode.content
                    : Buffer.from(resultNode.content).toString()
                const parsed = JSON.parse(raw)
                const newsletters =
                    parsed?.data?.['xwa2_newsletter_subscribed'] ||
                    parsed?.data?.['newsletter_subscribed'] ||
                    parsed?.data?.['subscribed'] ||
                    []

                if (newsletters.length > 0) {
                    for (const ch of newsletters) {
                        if (!ch.id) continue
                        data[ch.id] = {
                            id: ch.id,
                            name: ch.thread_metadata?.name?.text || ch.name || 'Unknown',
                            subscribers: ch.thread_metadata?.subscribers_count || 0
                        }
                    }
                    break
                }
            } catch {}
        }
        return data
    }

    await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } })

    global.jpmchRunning = true
    global.jpmchStop = false

    try {
        const channels = await fetchSubscribedChannels(conn)
        const channelIds = Object.keys(channels)

        if (channelIds.length === 0) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return RaplyGwe('❌ *Tidak ada channel*\n\n> Bot belum subscribe channel apapun.')
        }

        const jedaJpm = Number(config.jpmchDelay) || 5000
        const ctx = {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluranId,
                newsletterName: config.saluranName,
                serverMessageId: 127
            }
        }

        const preview = teks
            ? teks.substring(0, 60) + (teks.length > 60 ? '...' : '')
            : 'Tidak ada'

        await RaplyGwe(`
  ❰ *𝖯𝖱𝖮𝖲𝖤𝖲 𝖲𝖤𝖭𝖣* ❱
> 📝 Pesan   : *${preview}*
> 📷 Media   : *${mediaBuffer ? mediaType : 'Tidak ada'}*
> 📺 Target  : *${channelIds.length}* channel
_Sedang mengirim ke semua channel_`)

        let xsaluran = 0
        let xfailed = 0
        const failedChannels = []

        for (const chId of channelIds) {
            if (global.jpmchStop) {
                await conn.sendMessage(m.chat, { react: { text: '⏹️', key: m.key } })
                return RaplyGwe(`
  ❰ *𝖣𝖨𝖧𝖤𝖭𝖳𝖨𝖪𝖠𝖭 𝖲𝖤𝖭𝖣* ❱
> ▢ Berhasil: *${xsaluran}*
> ▢ Gagal: *${xfailed}*
> ▢ Sisa: *${channelIds.length - xsaluran - xfailed}*`)
            }

            try {
                const payload = !mediaBuffer
                    ? { text: teks, contextInfo: ctx }
                    : mediaType === 'audio'
                        ? { audio: mediaBuffer, mimetype: mediaMsg?.mimetype || 'audio/mp4', contextInfo: ctx }
                        : { [mediaType]: mediaBuffer, caption: teks, contextInfo: ctx }

                await conn.sendMessage(chId, payload)
                xsaluran++
            } catch (err) {
                xfailed++
                failedChannels.push(channels[chId]?.name || chId)
            }

            await sleep(jedaJpm)
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        let xmsg = `╭─❰ *𝖲𝖴𝖢𝖢𝖤𝖲𝖲𝖤𝖣 𝖲𝖤𝖭𝖣* ❱
└▢ *Pesan:* Terkirim
└▢ *${xsaluran} Saluran*
└▢ *Status:* Berhasil!
└▢ *Creator:* FyzzModss`

        if (failedChannels.length > 0) {
            xmsg += `\n└▢ *Channel Gagal:*\n` +
                failedChannels.map((n, i) => `> ${i + 1}. ${n}`).join('\n')
        }

        await RaplyGwe(xmsg)
    } catch (err) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`Terjadi error: ${err?.message || err}`)
    } finally {
        global.jpmchRunning = false
        global.jpmchStop = false
    }
}

handler.help = ['jpmch <teks>', 'stopjpmch']
handler.tags = ['jpm']
handler.command = /^(jpmch|stopjpmch)$/i
handler.owner = true

export default handler
