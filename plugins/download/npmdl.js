import { getPackage, download } from '../../lib/downloader.js'

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    const pkg = (text || args[0] || '').trim()
    if (!pkg) return RaplyGwe(`Masukkan nama paket npm!\nContoh: *${usedPrefix + command}* axios`)

    // Validasi nama paket npm biar gak bisa diisengin path traversal!
    // Nama paket npm cuma boleh huruf, angka, -, _, ., /, @
    if (!/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(pkg)) {
        return RaplyGwe('❌ Nama paket tidak valid!\nContoh yang bener: *axios*, *@babel/core*, *express*')
    }

    await m.react('🕒')
    try {
        const meta = await getPackage(pkg)
        if (!meta || !meta.tarball) throw new Error('Paket tidak ditemukan di NPM!')

        // Cek ukuran dulu biar gak jebol! Max 90MB
        if (meta.size && meta.size > 90 * 1024 * 1024) {
            await m.react('❌')
            return RaplyGwe(`❌ Paket *${meta.name}* kegedean bung! *${(meta.size / 1024 / 1024).toFixed(1)} MB*\n\nDownload manual aja ya:\n${meta.tarball}`)
        }

        const buffer = await download(meta.tarball)

        // Cek lagi ukuran buffer nya!
        if (buffer.length > 90 * 1024 * 1024) {
            await m.react('❌')
            return RaplyGwe(`❌ Hasil download kegedean! *${(buffer.length / 1024 / 1024).toFixed(1)} MB*`)
        }

        await conn.sendMessage(m.chat, {
            document: buffer,
            mimetype: 'application/gzip',
            fileName: `${meta.name.replace(/[\/@]/g, '_')}-${meta.version}.tgz`,
            caption: `*📦 NPM Download*\n\n*Paket:* ${meta.name}\n*Versi:* ${meta.version}\n*Deskripsi:* ${meta.description || '-'}\n*Ukuran:* ${(buffer.length / 1024).toFixed(1)} KB`
        }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        console.log('NPMDL ERROR:', e.message)
        await RaplyGwe(`❌ *Gagal:* ${e.message || 'Paket tidak ditemukan atau gagal diunduh.'}\n\nCoba cek nama paket nya di https://www.npmjs.com/package/${pkg}`)
    }
}

handler.help = ['npmdl <paket>']
handler.tags = ['downloader']
handler.command = /^(npmdl)$/i

export default handler
