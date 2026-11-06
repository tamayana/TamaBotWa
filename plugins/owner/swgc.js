import { resolveStatusSource, prepareGroupStatus, relayGroupStatus, getRawArgs } from '../../handler.js'

let handler = async (m, { conn, args, prefix, RaplyGwe }) => {
    const p = prefix || '.'
    const usage = `Contoh:\n${p}swgc teks story\n${p}swgc (reply / kirim gambar, video, audio)\n${p}swgc 1203xxxx@g.us teks (dari chat pribadi)`

    let target = m.isGroup ? m.chat : null
    let caption = getRawArgs(m)
    if (/@g\.us$/.test(args[0] || '')) {
        target = args[0]
        caption = caption.replace(/^\S+\s*/, '')
    }
    if (!target) return RaplyGwe(usage)

    try {
        const metadata = await conn.groupMetadata(target).catch(() => null)
        if (!metadata) return RaplyGwe('Grup tidak ditemukan / bot bukan anggota grup itu.')

        const src = await resolveStatusSource(m, caption)
        if (src.error) return RaplyGwe(`${src.error}\n\n${usage}`)

        await relayGroupStatus(conn, target, await prepareGroupStatus(conn, src))
        await RaplyGwe(`✅ Story berhasil dibuat di grup *${metadata.subject}*.`)
    } catch (e) {
        await RaplyGwe(`❌ Gagal membuat story: ${e.message}`)
    }
}

handler.help = ['swgc <teks>']
handler.tags = ['owner']
handler.command = /^(swgc)$/i
handler.owner = true

export default handler
