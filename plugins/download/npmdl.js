import { getPackage, download } from '../../lib/downloader.js'

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    const pkg = (text || args[0] || '').trim()
    if (!pkg) return RaplyGwe(`Masukkan nama paket npm!\nContoh: *${usedPrefix + command}* axios`)

    await m.react('🕒')
    try {
        const meta = await getPackage(pkg)
        const buffer = await download(meta.tarball)
        await conn.sendMessage(m.chat, {
            document: buffer,
            mimetype: 'application/gzip',
            fileName: `${meta.name.replace(/[\/@]/g, '_')}-${meta.version}.tgz`,
            caption: `*NPM Download*\n\n*Paket:* ${meta.name}\n*Versi:* ${meta.version}\n*Deskripsi:* ${meta.description}`
        }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        await RaplyGwe('Paket tidak ditemukan atau gagal diunduh.')
    }
}

handler.help = ['npmdl <paket>']
handler.tags = ['downloader']
handler.command = /^(npmdl)$/i

export default handler
