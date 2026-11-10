// plugins/fun/animehot.js

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, {
            text: `🔍 Lagi cariin anime cantik buat lu...`
        }, { quoted: m })

        // API SFW - Aman, gak vulgar, gak bikin ke-ban!
        let res = await fetch('https://api.kyzzz.xyz/api/image/anime-hot?apikey=kyzz97028012909957')
        let json = await res.json()

        if (!json.url) throw new Error('Gagal dapet gambar!')

        await conn.sendMessage(m.chat, {
            image: { url: json.url },
            caption: `✨ *ANIMEHOT*\n\nNih anime cantik buat lu!\nKetik *.animehot* lagi buat ganti!`
        }, { quoted: m })

    } catch (e) {
        console.log('ANIMEHOT ERROR:', e.message)
        await conn.sendMessage(m.chat, {
            text: `❌ Gagal ambil gambar, coba lagi nanti!`
        }, { quoted: m })
    }
}

handler.help = ['animehot']
handler.tags = ['fun']
handler.command = /^(animehot)$/i

export default handler
