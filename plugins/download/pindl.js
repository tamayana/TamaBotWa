import axios from 'axios'
import config from '../../config.js'

async function pindl(url) {
    let { data } = await axios.get(url, {
        headers: {
            'User-Agent': "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36",
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 20000,
        maxRedirects: 5
    })

    let matchLeaf = data.match(/<script[^>]*data-test-id="leaf-snippet"[^>]*>([\s\S]*?)<\/script>/i)
    let matchVideo = data.match(/<script[^>]*data-test-id="video-snippet"[^>]*>([\s\S]*?)<\/script>/i)

    if (!matchLeaf) throw new Error('Data gambar tidak ditemukan. Link mungkin private / sudah dihapus.')

    let info = JSON.parse(matchLeaf[1])
    let videoInfo = matchVideo ? JSON.parse(matchVideo[1]) : null

    // Upgrade kualitas gambar Pinterest! 736x -> original!
    // Pinterest biasanya ngasih URL 736x, kita ubah jadi original!
    let image = info.image || ''
    if (image) {
        image = image.replace(/\/736x\//, '/originals/').replace(/\/474x\//, '/originals/').replace(/\/236x\//, '/originals/')
    }

    return {
        isVideo: !!videoInfo,
        image,
        video: videoInfo ? videoInfo.contentUrl : ''
    }
}

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    let url = (text || args[0] || '').trim()

    if (!url || (!url.includes('pinterest.com') && !url.includes('pin.it'))) {
        return RaplyGwe(`Kirimkan link Pinterest!\nContoh: *${usedPrefix + command}* https://pin.it/xxx`)
    }

    await m.react('⏳')

    try {
        let res = await pindl(url)
        if (!res.image && !res.video) throw new Error('Media tidak ditemukan.')

        let ctx = {
            forwardingScore: 9,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluranId,
                newsletterName: config.saluranName,
                serverMessageId: 127
            }
        }

        if (res.isVideo && res.video) {
            await conn.sendMessage(m.chat, { 
                video: { url: res.video }, 
                caption: '✅ *PINTEREST DOWNLOADER*',
                contextInfo: ctx 
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { 
                image: { url: res.image },
                caption: '✅ *PINTEREST DOWNLOADER*',
                contextInfo: ctx 
            }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        await m.react('❌')
        console.log('PINDL ERROR:', e.message)
        await RaplyGwe(`❌ *Gagal:* ${e.message}\n\nCoba pastikan link nya public & bukan pin private!`)
    }
}

handler.command = /^(pindl|pinterest)$/i
handler.tags = ['downloader']
handler.help = ['pindl <url>']

export default handler
