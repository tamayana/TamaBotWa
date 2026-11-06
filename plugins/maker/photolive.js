import sharp from 'sharp'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@adiwajshing/baileys'
import { ffmpeg } from '../../lib/converter.js'

const FPS = 25
const SECONDS = 3
const FRAMES = FPS * SECONDS
const MAX_SIDE = 960

let handler = async (m, { conn, usedPrefix, command, RaplyGwe }) => {
    const q = m.quoted ? m.quoted : m
    const content = q.msg || q
    const mime = content.mimetype || ''
    const isImage = /image\/(jpe?g|png|webp)/i.test(mime)
    const isVideo = /video/i.test(mime)

    if (!isImage && !isVideo) {
        return RaplyGwe(`Kirim / balas *foto* atau *video* dengan perintah *${usedPrefix + command}*`, 'Photo Live')
    }
    if (isVideo && (content.seconds || 0) > 60) {
        return RaplyGwe('Durasi video maksimal 60 detik.', 'Photo Live')
    }

    await m.react('⌛')

    try {
        const buffer = await q.download()
        if (!buffer || !buffer.length) throw new Error('Gagal mengunduh media')

        let video // klip pendek (bagian "live")
        let still // foto diam (bagian "foto")

        if (isImage) {
            // Foto: putar sesuai EXIF, batasi ukuran, hilangkan transparansi
            const { data, info } = await sharp(buffer)
                .rotate()
                .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside' })
                .flatten({ background: '#000000' })
                .jpeg({ quality: 92 })
                .toBuffer({ resolveWithObject: true })

            // Ukuran video harus genap
            const w = info.width - (info.width % 2)
            const h = info.height - (info.height % 2)
            if (w < 2 || h < 2) throw new Error('Ukuran foto terlalu kecil')

            // Gerakan halus ala Live Photo: kamera melayang lalu kembali ke posisi awal, cahaya berdenyut tipis
            const p = `on/${FRAMES}`
            const z = `1+0.07*(1-cos(2*PI*${p}))/2`
            const x = `(iw-iw/(${z}))*(0.5+0.35*sin(2*PI*${p}))`
            const y = `(ih-ih/(${z}))*(0.5+0.25*cos(2*PI*${p}))`
            const filter = [
                `scale=${w * 3}:${h * 3}:flags=lanczos`,
                `zoompan=z='${z}':x='${x}':y='${y}':d=${FRAMES}:s=${w}x${h}:fps=${FPS}`,
                `eq=brightness='0.025*sin(2*PI*t/${SECONDS})':contrast='1+0.03*sin(2*PI*t/${SECONDS})':eval=frame`,
                'format=yuv420p'
            ].join(',')

            video = await ffmpeg(data, [
                '-vf', filter, '-frames:v', String(FRAMES),
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22',
                '-movflags', '+faststart', '-an'
            ], 'jpg', 'mp4')
            still = data
        } else {
            // Video: ambil 3 detik pertama, ukuran genap, format H.264 yang aman untuk WhatsApp
            const ext = mime.split(';')[0].split('/')[1] || 'mp4'
            video = await ffmpeg(buffer, [
                '-t', String(SECONDS),
                '-map', '0:v:0', '-map', '0:a:0?',
                '-vf', `scale='min(${MAX_SIDE},iw)':'min(${MAX_SIDE},ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p`,
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
                '-c:a', 'aac', '-b:a', '96k',
                '-movflags', '+faststart'
            ], ext, 'mp4')
            // Foto diam = frame pertama video
            still = await ffmpeg(video, ['-frames:v', '1', '-q:v', '2'], 'mp4', 'jpg')
        }

        // Siapkan media untuk WhatsApp
        const imageMedia = await prepareWAMessageMedia({ image: still }, { upload: conn.waUploadToServer })
        const videoMedia = await prepareWAMessageMedia({ video }, { upload: conn.waUploadToServer })

        // 1) Kirim foto (induk Live Photo)
        const photoMsg = generateWAMessageFromContent(m.chat, {
            imageMessage: {
                ...imageMedia.imageMessage,
                contextInfo: { pairedMediaType: 5, statusSourceType: 0 }
            }
        }, { quoted: m, userJid: conn.user?.id })

        await conn.relayMessage(m.chat, photoMsg.message, { messageId: photoMsg.key.id })

        // 2) Kirim video (anak) yang dikaitkan ke foto sebagai gerakan Live Photo
        await conn.relayMessage(m.chat, {
            videoMessage: {
                ...videoMedia.videoMessage,
                seconds: SECONDS,
                contextInfo: { pairedMediaType: 6, statusSourceType: 0 }
            },
            messageContextInfo: {
                messageAssociation: { associationType: 12, parentMessageKey: photoMsg.key }
            }
        }, {})

        await m.react('✅')
    } catch (e) {
        console.error('[photolive]', e)
        await m.react('❌')
        await RaplyGwe(`Gagal membuat Photo Live: ${e.message}`, 'Photo Live')
    }
}

handler.help = ['photolive']
handler.tags = ['maker']
handler.command = /^(photolive|livephoto|plive)$/i

export default handler
