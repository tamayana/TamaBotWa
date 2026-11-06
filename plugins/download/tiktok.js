import axios from 'axios'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'
import { ffmpeg, getFfmpegPath } from '../../lib/converter.js'
import config from '../../config.js'

const CDN = 'https://www.tikwm.com'

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    const query = (text || args[0] || '').trim()

    if (!query) return RaplyGwe(`Kirim link TikTok!\nContoh: *${usedPrefix + command}* https://vt.tiktok.com/xxxx`)
    if (!/tiktok\.com/i.test(query)) return RaplyGwe('Link tidak valid. Pastikan link berasal dari TikTok.')

    await m.react('⌛')

    try {
        /// ─────────── [ 𝖠𝗆𝖻𝗂𝗅 𝖣𝖺𝗍𝖺 ] ────────── ///
        const { data } = await axios.post('https://www.tikwm.com/api/', {}, {
            headers: {
                Accept: 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Origin: 'https://www.tikwm.com',
                Referer: 'https://www.tikwm.com/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            },
            params: { url: query, count: 12, cursor: 0, web: 1, hd: 1 },
            timeout: 60000
        })

        if (data?.code !== 0 || !data?.data) throw new Error(data?.msg || 'Gagal mengambil data dari TikWM')

        const res = data.data
        const isSlide = res.duration === 0 && Array.isArray(res.images) && res.images.length > 0

        const title = res.title || '-'
        const author = res.author?.nickname || '-'
        const username = res.author?.unique_id || '-'
        const musicTitle = res.music_info?.title || '-'
        const musicAuthor = res.music_info?.author || '-'
        const views = Number(res.play_count || 0).toLocaleString('id-ID')
        const likes = Number(res.digg_count || 0).toLocaleString('id-ID')
        const comments = Number(res.comment_count || 0).toLocaleString('id-ID')
        const shares = Number(res.share_count || 0).toLocaleString('id-ID')

        /// ─────────── [ 𝖬𝗈𝖽𝖾 𝖲𝗅𝗂𝖽𝖾𝗌𝗁𝗈𝗐 ] ────────── ///
        if (isSlide) {
            const caption = `📸 *𝗧 𝗜 𝗞 𝗧 𝗢 𝗞  -  𝗗 𝗢 𝗪 𝗡 𝗟 𝗢 𝗔 𝗗 𝗘 𝗥*\n\n`
                + `- Author: *${author}* (${username})\n`
                + `- Caption: ${title}\n`
                + `- Music: ${musicTitle} - ${musicAuthor}\n`
                + `- Region: ${res.region || '-'}\n\n`
                + `*Statistik Konten:*\n`
                + `- Views: *${views}*\n`
                + `- Likes: *${likes}*\n`
                + `- Comments: *${comments}*\n`
                + `- Shares: *${shares}*`

            const slides = res.images.slice(0, 10).map((url, i) => ({
                image: { url },
                caption: i === 0 ? caption : '',
                ...(i === 0 && {
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
            }))

            await conn.sendMessage(m.chat, { albumMessage: slides }, { quoted: m })
            await m.react('✅')
            return
        }

        /// ─────────── [ 𝖬𝗈𝖽𝖾 𝖵𝗂𝖽𝖾𝗈 ] ────────── ///
        const caption = `🎵 *𝗧 𝗜 𝗞 𝗧 𝗢 𝗞  -  𝗗 𝗢 𝗪 𝗡 𝗟 𝗢 𝗔 𝗗 𝗘 𝗥*\n\n`
            + `- Author: *${author}* (${username})\n`
            + `- Caption: ${title}\n`
            + `- Music: ${musicTitle} - ${musicAuthor}\n`
            + `- Duration: ${res.duration} detik\n`
            + `- Region: ${res.region || '-'}\n\n`
            + `*Statistik Video:*\n`
            + `- Views: *${views}*\n`
            + `- Likes: *${likes}*\n`
            + `- Comments: *${comments}*\n`
            + `- Shares: *${shares}*`

        let video = null
        for (const relPath of [res.hdplay, res.play, res.wmplay]) {
            if (!relPath) continue
            try {
                const videoRes = await axios.get(`${CDN}${relPath}`, { responseType: 'arraybuffer', timeout: 180000, maxContentLength: Infinity })
                const buf = Buffer.from(videoRes.data)
                if (buf.length > 10 * 1024) { video = buf; break }
            } catch {}
        }
        if (!video) throw new Error('Gagal mengunduh video dari server')

        let needConvert = video.toString('ascii', 4, 8) !== 'ftyp'
        if (!needConvert) {
            const probeFile = path.join(os.tmpdir(), `tt_probe_${Date.now()}.mp4`)
            fs.writeFileSync(probeFile, video)
            const probe = spawnSync(getFfmpegPath(), ['-hide_banner', '-i', probeFile], { encoding: 'utf8' })
            fs.rmSync(probeFile, { force: true })
            needConvert = /Video: (hevc|h265|vp9|av1)/i.test(probe.stderr || '')
        }
        if (needConvert) {
            video = await ffmpeg(video, ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart'], 'mp4', 'mp4')
        }

        if (video.length > 60 * 1024 * 1024) {
            await conn.sendMessage(m.chat, { 
                document: video, 
                mimetype: 'video/mp4', 
                fileName: `tiktok_${Date.now()}.mp4`, 
                caption,
                contextInfo: {
                    forwardingScore: 9,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: config.saluranId,
                        newsletterName: config.saluranName,
                        serverMessageId: 127
                    }
                }
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { 
                video, 
                mimetype: 'video/mp4', 
                caption,
                contextInfo: {
                    forwardingScore: 9,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: config.saluranId,
                        newsletterName: config.saluranName,
                        serverMessageId: 127
                    }
                }
            }, { quoted: m })
        }

        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe(`Terjadi kesalahan saat memproses TikTok: ${e.message}`)
    }
}

handler.help = ['tiktok <link>']
handler.tags = ['downloader']
handler.command = /^(tiktok|tt)$/i

export default handler