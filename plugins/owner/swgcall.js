import config from '../../config.js'
import { resolveStatusSource, prepareGroupStatus, relayGroupStatus, listGroups, getRawArgs, sleep } from '../../handler.js'

let handler = async (m, { conn, prefix, RaplyGwe }) => {
    const p = prefix || '.'

    try {
        const src = await resolveStatusSource(m, getRawArgs(m))
        if (src.error) {
            return RaplyGwe(`${src.error}\n\nContoh:\n${p}swgcall teks story\n${p}swgcall (reply / kirim gambar, video, audio)`)
        }

        const groups = await listGroups(conn)
        if (!groups.length) return RaplyGwe('Bot belum bergabung di grup mana pun.')

        await RaplyGwe(`⏳ Mengirim story ke *${groups.length}* grup, mohon tunggu...`)

        const inside = await prepareGroupStatus(conn, src)
        let success = 0
        const failed = []

        for (const group of groups) {
            try {
                await relayGroupStatus(conn, group.id, inside)
                success++
            } catch {
                failed.push(group.subject)
            }
            await sleep(config.swgcDelay || 2500)
        }

        let result = `✅ Berhasil: *${success}* grup\n❌ Gagal: *${failed.length}* grup`
        if (failed.length) {
            result += `\n\n${failed.slice(0, 15).map(name => `- ${name}`).join('\n')}`
            if (failed.length > 15) result += `\n- dan ${failed.length - 15} grup lainnya`
        }
        await RaplyGwe(result)
    } catch (e) {
        await RaplyGwe(`❌ Gagal membuat story: ${e.message}`)
    }
}

handler.help = ['swgcall <teks>']
handler.tags = ['owner']
handler.command = /^(swgcall)$/i
handler.owner = true

export default handler
