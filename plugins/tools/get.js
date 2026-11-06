import dns from 'dns/promises'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const input = (text || '').trim()

    if (!input) {
        return m.reply(`Masukkan URL yang valid.\n\nContoh:\n${usedPrefix + command} https://api.github.com/users/octocat`)
    }

    const match = input.match(/https?:\/\/[^\s]+/i)
    if (!match) return m.reply('Format URL tidak valid. Harus diawali dengan http:// atau https://')

    const maxSize = 50 * 1024 * 1024
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8'
    }
    const isPrivate = (ip) => /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|::$|f[cd][0-9a-f]{2}:|fe80:)/i.test(ip.replace(/^::ffff:/i, ''))

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        let targetUrl = match[0]
        let res

        for (let hop = 0; hop <= 5; hop++) {
            const { hostname } = new URL(targetUrl)
            const records = await dns.lookup(hostname, { all: true })
            if (!records.length || records.some(r => isPrivate(r.address))) {
                throw new Error('URL mengarah ke alamat internal dan tidak diizinkan.')
            }

            res = await fetch(targetUrl, { headers, redirect: 'manual', signal: AbortSignal.timeout(30000) })

            const location = res.headers.get('location')
            if (res.status >= 300 && res.status < 400 && location) {
                if (hop === 5) throw new Error('Terlalu banyak redirect.')
                targetUrl = new URL(location, targetUrl).href
                continue
            }
            break
        }

        const type = res.headers.get('content-type') || ''
        const info = `${res.status} ${res.statusText}`.trim()
        const length = Number(res.headers.get('content-length') || 0)
        if (length > maxSize) throw new Error('Ukuran file melebihi batas 50 MB.')

        const buffer = Buffer.from(await res.arrayBuffer())
        if (buffer.length > maxSize) throw new Error('Ukuran file melebihi batas 50 MB.')
        if (!buffer.length) throw new Error(`Respons kosong (${info}).`)

        const name = decodeURIComponent(new URL(targetUrl).pathname.split('/').pop() || '') || 'file'

        if (/image\/(?!svg)/i.test(type)) {
            await conn.sendMessage(m.chat, { image: buffer, caption: `Fetch berhasil (${info})\n${targetUrl}` }, { quoted: m })
        } else if (/video\//i.test(type)) {
            await conn.sendMessage(m.chat, { video: buffer, caption: `Fetch berhasil (${info})\n${targetUrl}` }, { quoted: m })
        } else if (/audio\//i.test(type)) {
            await conn.sendMessage(m.chat, { audio: buffer, mimetype: type.split(';')[0] }, { quoted: m })
        } else if (/json|text|xml|javascript|svg|html/i.test(type) || !type) {
            let output = buffer.toString('utf-8')
            let ext = 'txt'

            if (/json/i.test(type)) {
                try { output = JSON.stringify(JSON.parse(output), null, 2) } catch {}
                ext = 'json'
            } else if (/html/i.test(type)) {
                ext = 'html'
            }

            if (output.length > 4000) {
                await conn.sendMessage(m.chat, {
                    document: Buffer.from(output, 'utf-8'),
                    mimetype: ext === 'json' ? 'application/json' : 'text/plain',
                    fileName: `response.${ext}`,
                    caption: `Respons (${info})\n${targetUrl}`
                }, { quoted: m })
            } else {
                await m.reply(output)
            }
        } else {
            await conn.sendMessage(m.chat, {
                document: buffer,
                mimetype: type.split(';')[0] || 'application/octet-stream',
                fileName: name,
                caption: `File (${info})\n${targetUrl}`
            }, { quoted: m })
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        console.error('[fetch]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await m.reply(`❌ *Gagal:* ${e.name === 'TimeoutError' ? 'Permintaan timeout.' : (e.cause?.code || e.message || 'Terjadi kesalahan.')}`)
    }
}

handler.help = ['get <url>']
handler.tags = ['tools']
handler.command = /^(fetch|get)$/i

export default handler
