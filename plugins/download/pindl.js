import axios from 'axios'
import config from '../../config.js'

async function pindl(url) {
    try {
        let { data } = await axios.get(url, {
            headers: {
                'User-Agent': "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36",
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        })

        let matchLeaf = data.match(/<script[^>]*data-test-id="leaf-snippet"[^>]*>([\s\S]*?)<\/script>/i)
        let matchVideo = data.match(/<script[^>]*data-test-id="video-snippet"[^>]*>([\s\S]*?)<\/script>/i)

        if (!matchLeaf) throw new Error('Data gambar tidak ditemukan.')

        let info = JSON.parse(matchLeaf[1])
        let videoInfo = matchVideo ? JSON.parse(matchVideo[1]) : null

        return {
            status: true,
            isVideo: !!videoInfo,
            image: info.image,
            video: videoInfo ? videoInfo.contentUrl : ''
        }
    } catch (e) {
        return { status: false, mess: e.message || 'Gagal mengunduh media.' }
    }
}

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    let url = text || args[0]

    if (!url || (!url.includes('pinterest.com') && !url.includes('pin.it'))) {
        return RaplyGwe(`Kirimkan link Pinterest!\nContoh: *${usedPrefix + command}* https://pin.it/xxx`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        let res = await pindl(url.trim())
        if (!res.status) throw new Error(res.mess)

        let ctx = {
            forwardingScore: 9,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluranId,
                newsletterName: config.saluranName,
                serverMessageId: 127
            }
        }

        if (res.isVideo) {
            await conn.sendMessage(m.chat, { 
                video: { url: res.video }, 
                contextInfo: ctx 
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { 
                image: { url: res.image }, 
                contextInfo: ctx 
            }, { quoted: m })
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.message}`)
    }
}

handler.command = /^(pindl|pinterest)$/i
handler.tags = ['downloader']
handler.help = ['pindl <url>']

export default handler
