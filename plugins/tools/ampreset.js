import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command, RaplyGwe }) => {
    const url = (args[0] || text || '').trim()

    if (!/^https?:\/\/\S+$/i.test(url)) {
        return RaplyGwe(`Kirim link video TikTok yang ingin dicari presetnya.\n\nContoh:\n*${usedPrefix + command}* https://vt.tiktok.com/xxxx`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const { data } = await axios.get('https://api.kyzzz.xyz/api/tools/amfind', {
            params: { url, apikey: 'kyzz211554828' },
            timeout: 120000
        })

        if (!data?.status || !data?.result) throw new Error(data?.message || 'Data tidak ditemukan.')

        const { videoMeta: meta = {}, stats = {}, results = [] } = data.result
        const num = (n) => Number(n || 0).toLocaleString('id-ID')

        let msg = `*AM PRESET FINDER*\n\n`
        msg += `*Video*\n`
        msg += `Akun : ${meta.author?.nickname || '-'} (@${meta.author?.username || '-'})\n`
        msg += `Deskripsi : ${(meta.desc || '-').trim()}\n`
        msg += `Views : ${num(meta.stats?.views)} | Likes : ${num(meta.stats?.likes)}\n`
        msg += `Komentar : ${num(meta.stats?.comments)} | Dibagikan : ${num(meta.stats?.shares)}\n\n`
        msg += `*Hasil Pemindaian*\n`
        msg += `Komentar utama : ${num(stats.mainCommentsScanned)}\n`
        msg += `Balasan : ${num(stats.repliesScanned)}\n`
        msg += `Link ditemukan : ${num(stats.foundCount ?? results.length)}\n`

        if (!results.length) {
            msg += `\nTidak ada link preset yang ditemukan pada video ini.`
        }

        results.forEach((item, i) => {
            const waktu = item.time
                ? new Date(item.time * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })
                : '-'

            msg += `\n*${i + 1}. Preset*\n`
            msg += `Link : ${item.link}\n`
            msg += `Sumber : ${item.type || '-'}\n`
            msg += `Pengirim : ${item.nickname || '-'} (@${item.author || '-'})\n`
            msg += `Likes : ${num(item.likes)} | Waktu : ${waktu}\n`

            if (item.otherLinks?.length) {
                msg += `Link lain :\n${item.otherLinks.map(l => `- ${l}`).join('\n')}\n`
            }
        })

        await RaplyGwe(msg.trim())
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        console.error('[ampreset]', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal:* ${e.response?.data?.message || e.message || 'Terjadi kesalahan.'}`)
    }
}

handler.command = ['ampreset']
handler.tags = ['tools']
handler.help = ['ampreset <url>']

export default handler
