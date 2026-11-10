import JavaScriptObfuscator from 'javascript-obfuscator'

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let code = text || ''

    if (!code && m.quoted && /javascript|text|octet-stream/.test(mime)) {
        let buffer = await q.download().catch(() => null)
        if (buffer) code = buffer.toString('utf-8')
    }

    if (!code && m.quoted?.text) code = m.quoted.text

    if (!code.trim()) {
        return RaplyGwe(`Masukkan kode atau balas file .js!\n\nContoh: *${usedPrefix + command}* console.log("Hello")`)
    }

    await m.react('🕒')

    try {
        // ENC LANGSUNG DI BOT BUNG! GAK PERLU KIRIM KE SERVER ORANG LAGI!
        // Kode lu aman, gak ada yang bisa nyuri!
        const result = JavaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            selfDefending: true,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        })

        const obfuscated = result.getObfuscatedCode()

        await conn.sendMessage(m.chat, {
            document: Buffer.from(obfuscated, 'utf-8'),
            mimetype: 'application/javascript',
            fileName: 'enc.js',
            caption: `✅ *Enc berhasil*\n\n◦ Ukuran asli: ${code.length}\n◦ Ukuran hasil: ${obfuscated.length}\n◦ Mode: Local (Tanpa API)`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error('[enc]', e)
        await m.react('❌')
        await RaplyGwe(`❌ *Gagal:* ${e.message}`.slice(0, 600))
    }
}

handler.help = ['enc <kode>']
handler.tags = ['tools']
handler.command = /^(enc|encrypt|obfuscate)$/i

export default handler
