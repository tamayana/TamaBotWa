import axios from 'axios'
import crypto from 'crypto'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/video/.test(mime)) return m.reply(`Balas video dengan perintah *${usedPrefix + command}*`)

    m.reply('Sedang memproses video, mohon tunggu sebentar (bisa memakan waktu beberapa menit)...')

    try {
        let buffer = await q.download()
        let UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        let serial = crypto.createHash('md5').update(UA + Date.now()).digest('hex')

        let getHeaders = (extra = {}) => ({
            'accept': '*/*',
            'product-serial': serial,
            'user-agent': UA,
            'Referer': 'https://unblurimage.ai/',
            ...extra
        })

        let formReg = new FormData()
        formReg.append('video_file_name', crypto.randomBytes(3).toString('hex') + '_video.mp4')
        
        let reg = await axios.post('https://api.unblurimage.ai/api/upscaler/v1/ai-video-enhancer/upload-video', formReg, {
            headers: getHeaders(formReg.getHeaders())
        })

        let { url: ossUrl, object_name: objectName } = reg.data.result

        await axios.put(ossUrl, buffer, {
            headers: { 'Content-Type': 'video/mp4', 'User-Agent': UA }
        })

        let formJob = new FormData()
        formJob.append('original_video_file', `https://cdn.unblurimage.ai/${objectName}`)
        formJob.append('resolution', '')
        formJob.append('is_preview', 'false')

        let create = await axios.post('https://api.unblurimage.ai/api/upscaler/v2/ai-video-enhancer/create-job', formJob, {
            headers: getHeaders(formJob.getHeaders())
        })

        let jobId = create.data.result?.job_id
        if (!jobId) return m.reply('Gagal membuat tugas pemrosesan.')

        let outputUrl = null
        for (let i = 0; i < 60; i++) {
            await new Promise(r => setTimeout(r, 5000))
            let check = await axios.get(`https://api.unblurimage.ai/api/upscaler/v2/ai-video-enhancer/get-job/${jobId}`, {
                headers: getHeaders()
            })
            if (check.data.result?.output_url) {
                outputUrl = check.data.result.output_url
                break
            }
        }

        if (!outputUrl) return m.reply('Proses timeout atau gagal.')

        await conn.sendMessage(m.chat, { 
            video: { url: outputUrl }, 
            caption: '✅ Video Berhasil di-Enhance (2K)' 
        }, { quoted: m })

    } catch (err) {
        m.reply('Terjadi kesalahan saat memproses video.')
    }
}

handler.help = ['hdvideo']
handler.tags = ['tools']
handler.command = /^(hdvideo|enhance)$/i

export default handler