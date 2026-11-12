let handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('Cuma di grup bung!')
    if (!args[0]) return m.reply('Mana nomornya? Contoh: .add 62812xxxx')

    let no = args[0].replace(/[^0-9]/g, '')
    if (no.startsWith('0')) no = '62' + no.slice(1)
    let jid = no + '@s.whatsapp.net'

    // AMBIL NAMA GRUP BIAR ENAK CHATNYA
    let groupName = 'grup ini'
    try {
        let metadata = await conn.groupMetadata(m.chat)
        groupName = metadata.subject
    } catch {}

    m.reply(`Oke gua coba add ${no} ya...`)

    try {
        let res = await conn.groupParticipantsUpdate(m.chat, [jid], 'add')
        let status = res[0]?.status

        // 1. KALO BERHASIL LANGSUNG MASUK
        if (status === '200') {
            return m.reply(`✅ Berhasil! ${no} udah masuk grup!`)
        }

        // 2. KALO GAGAL 403 = KENA PRIVASI, BOT LANGSUNG CHAT ORANGNYA!
        if (status === '403') {
            let code = res[0]?.content?.[0]?.content?.[0]?.attrs?.code
            if (!code) return m.reply(`⚠️ Gagal! Nomor ${no} nge-privasi, gak bisa di-add langsung.`)

            let link = 'https://chat.whatsapp.com/' + code

            // BOT LANGSUNG CHAT KE NOMOR YANG MAU DI ADD!
            try {
                await conn.sendMessage(jid, { 
                    text: `👋 Halo! Kamu diundang masuk ke grup *${groupName}* sama admin!\n\nGua mau add kamu langsung tapi privasi WA kamu nolak, jadi gua kirimin linknya aja ya!\n\nKlik link ini buat masuk:\n${link}\n\nDitunggu ya! Gas join! 🔥`
                })
                return m.reply(`✅ Udah gua chat langsung ke ${no}!\n\nGua kirimin link undangan ke WA dia, suruh dia klik linknya buat masuk!\nLinknya: ${link}`)
            } catch (e) {
                // KALO BOT GAK BISA CHAT DIA (MISAL DIA BLOCK BOT / NOMOR GAK ADA WA)
                return m.reply(`⚠️ Gagal add langsung, dan gua juga gagal chat dia!\n\nMungkin dia block bot / nomornya gak ada WA.\nNih linknya, kirim manual aja:\n${link}`)
            }
        }

        return m.reply(`Gagal add ${no}. Status: ${status}`)

    } catch (e) {
        return m.reply(`ERROR: ${e.message}`)
    }
}

handler.help = ['add']
handler.tags = ['group']
handler.command = /^(add)$/i
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler
