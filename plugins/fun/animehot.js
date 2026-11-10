// plugins/fun/animehot.js - VERSI FINAL, UDAH NYAMBUNG KE config.js!
import config from '../../config.js'

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, {
            text: `🔍 Lagi cariin anime cantik buat lu...`
        }, { quoted: m })

        // AMBIL KEY DARI config.js - YANG NAMA NYA kyzzApikey!
        let apikey = config.kyzzApikey
        if (!apikey) throw new Error('API Key belum diisi di config.js!')

        // ENDPOINT NYA PAKE anime-hot! BUKAN anime DOANG!
        let res = await fetch(`https://api.kyzzz.xyz/api/image/anime-hot?apikey=${apikey}`)

        if (!res.ok) {
            let body = await res.text()
            throw new Error(`API nya error! Status: ${res.status} | Pesan API: ${body.slice(0, 200)}`)
        }

        // CEK DULU, DIA BALIKIN JSON ATAU FOTO?
        let contentType = res.headers.get('content-type') || ''
        console.log('TIPE API:', contentType)

        let imgBuffer

        if (contentType.includes('application/json')) {
            // Kalo ternyata JSON
            let json = await res.json()
            console.log('ISI JSON:', json)
            let imgUrl = json.url || json.result || json.data || json.image
            if (!imgUrl) throw new Error('JSON nya gak ada link foto!')
            let res2 = await fetch(imgUrl)
            imgBuffer = Buffer.from(await res2.arrayBuffer())
        } else {
            // Kalo langsung foto, ambil buffer nya!
            imgBuffer = Buffer.from(await res.arrayBuffer())
        }

        await conn.sendMessage(m.chat, {
            image: imgBuffer,
            caption: `✨ *ANIMEHOT*\n\nNih anime cantik buat lu!\nKetik *.animehot* lagi buat ganti!`
        }, { quoted: m })

    } catch (e) {
        console.log('ANIMEHOT ERROR:', e)
        await conn.sendMessage(m.chat, {
            text: `❌ Gagal ambil gambar!\nErrornya: ${e.message}`
        }, { quoted: m })
    }
}

handler.help = ['animehot']
handler.tags = ['fun']
handler.command = /^(animehot)$/i

export default handler
