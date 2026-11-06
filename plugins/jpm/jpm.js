import { downloadContentFromMessage } from '@adiwajshing/baileys'
import config from '../../config.js'
import { sleep } from '../../lib/myfunc.js'
import { isBlacklistedGc } from '../../lib/database.js'

let handler = async (m, { conn, command, prefix, RaplyGwe }) => {
    if (command === 'stopjpm') {
        if (!global.jpmRunning) return RaplyGwe('Tidak ada proses jpm yang sedang berjalan.')
        global.jpmStop = true
        return RaplyGwe('Permintaan berhenti diterima, jpm akan berhenti setelah pesan yang sedang dikirim.')
    }

    if (global.jpmRunning) {
        return RaplyGwe(`jpm masih berjalan.\nKetik *${prefix || '.'}stopjpm* untuk menghentikan.`)
    }

    let teks = (m.text || '').replace(/^\S+\s*/, '').trim()
    let mediaBuffer = null

    if (!teks && m.quoted) teks = (m.quoted.text || '').trim()

    const mediaMsg = m.quoted ? m.quoted.msg : m.msg
    const mediaType = { imageMessage: 'image', videoMessage: 'video', audioMessage: 'audio' }[m.quoted ? m.quoted.mtype : m.mtype]

    if (!teks && !mediaType) {
        const p = prefix || '.'
        return RaplyGwe(`Contoh:\n${p}jpm Halo semua\n${p}jpm (reply teks/gambar/video/audio)\n\nGrup yang ada di blacklist (${p}blgc) tidak akan dikirimi.`)
    }

    if (mediaType && mediaMsg && typeof mediaMsg === 'object') {
        try {
            const chunks = []
            for await (const chunk of await downloadContentFromMessage(mediaMsg, mediaType)) chunks.push(chunk)
            mediaBuffer = Buffer.concat(chunks)
            if (!mediaBuffer.length) mediaBuffer = null
        } catch {
            if (!teks) return RaplyGwe('Gagal mengunduh media, coba kirim ulang.')
        }
    }

    if (!teks && !mediaBuffer) return RaplyGwe('Gagal mengunduh media, coba kirim ulang.')

    global.jpmRunning = true
    global.jpmStop = false

    try {
        await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } }).catch(() => {})

        const all = await conn.groupFetchAllParticipating()
        const groups = Object.values(all || {}).map(g => ({ id: g.id, subject: g.subject || 'Tanpa Nama' }))
        const targets = groups.filter(g => !isBlacklistedGc(g.id))
        const skipped = groups.length - targets.length

        if (!targets.length) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
            return RaplyGwe(groups.length
                ? `❌ Semua grup (${groups.length}) ada di blacklist, tidak ada target jpm.`
                : '❌ Bot belum bergabung di grup mana pun.')
        }

        const delay = Number(config.jpmDelay) || 5000
        const preview = teks ? teks.substring(0, 60) + (teks.length > 60 ? '...' : '') : 'Tidak ada'

        await RaplyGwe(`*PROSES JPM*
> Pesan   : *${preview}*
> Media   : *${mediaBuffer ? mediaType : 'Tidak ada'}*
> Target  : *${targets.length}* grup
> Blacklist dilewati : *${skipped}* grup
> Jeda    : *${delay / 1000}* detik

_Sedang mengirim ke semua grup. Ketik ${prefix || '.'}stopjpm untuk berhenti._`)

        let success = 0
        let failed = 0
        const failedGroups = []
        let stopped = false

        for (const group of targets) {
            if (global.jpmStop) { stopped = true; break }
            if (isBlacklistedGc(group.id)) continue

            try {
                const payload = !mediaBuffer
                    ? { text: teks }
                    : mediaType === 'audio'
                        ? { audio: mediaBuffer, mimetype: mediaMsg?.mimetype || 'audio/mp4' }
                        : { [mediaType]: mediaBuffer, caption: teks }

                await conn.sendMessage(group.id, payload)
                success++
            } catch {
                failed++
                failedGroups.push(group.subject)
            }

            await sleep(delay)
        }

        await conn.sendMessage(m.chat, { react: { text: stopped ? '⏹️' : '✅', key: m.key } }).catch(() => {})

        let result = `${stopped ? '*JPM DIHENTIKAN*' : '*JPM SELESAI*'}
> Berhasil : *${success}* grup
> Gagal    : *${failed}* grup
> Blacklist dilewati : *${skipped}* grup`
        if (stopped) result += `\n> Sisa     : *${targets.length - success - failed}* grup`

        if (failedGroups.length) {
            result += `\n\n*Grup gagal:*\n` + failedGroups.slice(0, 15).map((n, i) => `${i + 1}. ${n}`).join('\n')
            if (failedGroups.length > 15) result += `\n... dan ${failedGroups.length - 15} grup lainnya`
        }

        await RaplyGwe(result)
    } catch (err) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
        await RaplyGwe(`Terjadi error: ${err?.message || err}`)
    } finally {
        global.jpmRunning = false
        global.jpmStop = false
    }
}

handler.help = ['jpm <teks>', 'stopjpm']
handler.tags = ['jpm']
handler.command = /^(jpm|stopjpm)$/i
handler.owner = true

export default handler
