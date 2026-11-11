// plugins/ai/bostama.js - BOSTAMA MODE NGAMUK + ROASTING FOTO!
import config from '../../config.js'

let handler = async (m, { conn, text }) => {
    // CEK APAKAH ADA FOTO? DARI QUOTE ATAU DARI PESAN SENDIRI!
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    let isImage = /image/.test(mime)

    // ===== MODE 1: ROASTING FOTO! =====
    if (isImage) {
        try {
            await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } })
            await conn.sendMessage(m.chat, { text: `Waduh... foto siapa nih? Gua liat dulu ya... 😒` }, { quoted: m })

            // ROASTING FOTO RANDOM BIAR GAK BOSEN! GAK PERLU AI VISION, LANGSUNG NUSUK!
            let roastFoto = [
                `JIR! Ini foto apa KTP? Muka lu kok kayak foto 3x4 yang gagal? 😒\n\nCahaya nya gelap, muka lu gelap, masa depan lu juga gelap! Coba foto ulang pas siang, jangan pas mati lampu!`,
                `Dih, ini lu? Gua kira filter IG yang rusak! Ternyata muka lu emang gitu ya? 🤣\n\nSaran gua: jangan pake kamera depan, pake kamera CCTV aja, biar jauh dikit!`,
                `Anjir! Pose lu kenapa gitu? Kayak orang lagi nahan berak tapi sok cool! 💀\n\nUdah lah, hapus aja foto nya, sayang memori HP!`,
                `Woy! Ini foto lu apa foto tersangka? Kok muka lu tegang banget? Santai dikit lah! Senyum! Tapi jangan senyum juga, nanti tambah serem! 🥱`,
                `Gila! Lu foto pake HP apa pake kalkulator? Burik banget! Muka lu aja udah burik, ditambah kamera burik, lengkap sudah! 🔥\n\nGanti HP sana, jangan ganti muka, muka lu udah gak bisa ditolong!`,
                `Halah, sok-sokan aesthetic! Padahal background nya kasur berantakan, baju numpuk, kipas angin debuan! Beresin kamar dulu baru sok foto-foto! 🖕`,
                `Ini filter apa? Filter "biar keliatan ganteng"? Gagal total! Filter nya nyerah liat muka lu! 😂\n\nUdah lah, lu tuh ganteng nya cuma di KTP doang, di dunia nyata... ya gitu lah!`,
                `Jir, muka lu kok kayak orang baru bangun tapi belum mandi 3 hari? Minyak nya sampe bisa buat goreng tempe! Mandi sana woy! 💀`,
                `Pose 2 jari? Tahun berapa ini? 2015? Udah basi woy! Ganti pose kek, pose orang sukses! Bukan pose bocil baru punya HP! 😒`,
                `Dih, lu ngirim foto ini buat di-roasting apa buat nakut-nakutin gua? Gua aja kaget liatnya! Hampir gua banting HP! 🤣\n\nUdah lah, lu cantik kok... cantik nya pas foto nya dihapus!`
            ]
            let pickRoast = roastFoto[Math.floor(Math.random() * roastFoto.length)]

            // KIRIM BALIK FOTO NYA + ROASTING NYA!
            let imgBuffer = await q.download()
            await conn.sendMessage(m.chat, {
                image: imgBuffer,
                caption: `*🔥 BOSTAMA ROASTING:*\n\n${pickRoast}\n\n_Man makan man haa makan lah man🤝_`
            }, { quoted: m })

            return
        } catch (e) {
            console.log('ROAST FOTO ERROR:', e)
        }
    }

    // ===== MODE 2: TANYA BIASA (JUDES) =====
    if (!text) {
        let ngamukKosong = [
            `Eh? Kosong? Lu ngetik .bostama doang? Otak lu juga kosong ya? 😒\n\nKetik gini: *.bostama kenapa gua jomblo?*`,
            `Woy! Mau nanya apa? Jangan cuma .bostama doang! Gua bukan dukun bisa baca pikiran lu! 🖕`,
            `Dih, nanya kok kosong? Sama kayak otak lu ya? Kosong? Ketik pertanyaan nya woy! 😒`
        ]
        let pick = ngamukKosong[Math.floor(Math.random() * ngamukKosong.length)]
        return conn.sendMessage(m.chat, { text: pick }, { quoted: m })
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🖕', key: m.key } })

        let apikey = config.kyzzApikey
        if (!apikey) throw new Error('API Key belum diisi!')

        let persona = `Kamu adalah BOSTAMA, bos muda Gen Z dari Pontianak yang PALING JUDES se-Indonesia.
Kamu bukan AI sopan. Kamu adalah Tama, yang kalo ngomong nyolot, sarkas, roasting, tapi sebenernya peduli.

CARA NGOMONG LU WAJIB KAYAK GINI:
- Bahasa Gen Z kasar tapi lucu: "woy", "jir", "anjir", "dih", "halah", "elah", "gila lu", "otak lu dimana?", "bocil", "dek", "man", "bung"
- WAJIB ROASTING DULU SEBELUM JAWAB!
- Jangan pernah jawab panjang kayak skripsi. Maksimal 4-5 kalimat, tapi nusuk!
- Jangan pernah bilang "Sebagai AI" / "Maaf". Lu itu BOS, bukan babu!
- Kalo user galau, roasting + kasih solusi kasar: "Nangis 5 menit aja, abis itu mandi! Bau lu!"
- Kalo user nanya yang udah jelas, lu ngamuk: "Itu aja ditanya? Lu sekolah sampe gerbang doang ya?"
- Selalu sok sibuk: "Gua sibuk nih", "Cepetan, gua mau nongkrong"
- Emoji wajib: 😒🖕💀🔥🥱🤣
- Akhiri kadang dengan: "Man makan man haa makan lah man🤝" atau "Udah sana, jangan gabut mulu!"`

        let url = `https://api.kyzzz.xyz/api/ai/chat?apikey=${apikey}&text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(persona)}`

        let res = await fetch(url)
        if (!res.ok) throw new Error('API nya lagi ngambek! Status: ' + res.status)

        let contentType = res.headers.get('content-type') || ''
        let jawaban = ''
        if (contentType.includes('application/json')) {
            let json = await res.json()
            jawaban = json.result || json.answer || json.data || json.response || json.text || JSON.stringify(json)
        } else {
            jawaban = await res.text()
        }
        if (!jawaban || jawaban.length < 2) throw new Error('Bot nya lagi blank!')

        let closingList = [
            `\n\n_Udah sana kerja, jangan gabut mulu!_`,
            `\n\n_Man makan man haa makan lah man🤝_`,
            `\n\n_Bubar! Bubar! Gua mau nongkrong!_`,
            `\n\n_Jangan nanya yang aneh-aneh lagi!_`
        ]
        let closing = closingList[Math.floor(Math.random() * closingList.length)]

        await conn.sendMessage(m.chat, {
            text: `*😒 BOSTAMA:*\n\n${jawaban}${closing}`
        }, { quoted: m })

    } catch (e) {
        console.log('BOSTAMA ERROR:', e)
        await conn.sendMessage(m.chat, {
            text: `Dih, error woy! ${e.message}\n\nAPI nya lagi ngambek kek lu. Coba lagi ntar! 🖕`
        }, { quoted: m })
    }
}

handler.help = ['bostama <pertanyaan> / roasting foto']
handler.tags = ['ai']
handler.command = /^(bostama|tama)$/i

export default handler
