// plugins/fun/cekgabut.js - VERSI KREATIF, GAK BOSENIN!
let handler = async (m, { conn }) => {
    let mentioned = (m.mentionedJid?.[0] || m.msg?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender).replace(/:\d+@/, '@')

    // HASIL KONSISTEN PER USER PER HARI! BIAR BISA DI-SS!
    let today = new Date().toISOString().slice(0, 10)
    let seedStr = mentioned + today + 'gabut'
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
    }
    let absHash = Math.abs(hash)
    let percent = absHash % 101

    // BAR GABUT BIAR KEK BATRE HP!
    let barLength = 10
    let filled = Math.round(percent / 10)
    let bar = '█'.repeat(filled) + '░'.repeat(barLength - filled)

    // RANK + ROASTING + KEGIATAN GABUT NYA!
    let rank, desc, kegiatan, emoji

    if (percent >= 95) {
        rank = 'RAJA GABUT SE-DUNIA 👑'
        desc = 'LU UDAH GAK BISA DISELAMATIN LAGI! LU BANGUN, MAKAN, REBAHAN, BANGUN LAGI! HIDUP LU MAMPIR DOANG DI BOT INI!'
        kegiatan = 'Nge-stalk mantan sampe 2019, terus nangis sendiri'
        emoji = '💀'
    } else if (percent >= 85) {
        rank = 'DEWA GABUT 🥱'
        desc = 'GABUT LEVEL MAX! Kerjaan lu cuma scroll TikTok sampe HP panas, terus ngeluh "kok bosen ya?"'
        kegiatan = 'Nontonin orang masak di TikTok padahal lu gak pernah masak'
        emoji = '🥱'
    } else if (percent >= 70) {
        rank = 'SULTAN GABUT 😴'
        desc = 'Gabut parah nih! Chat lu isinya cuma "P" doang ke semua orang, terus lu tinggal tidur!'
        kegiatan = 'Buka WA, tutup WA, buka WA lagi, padahal gak ada yang chat'
        emoji = '😴'
    } else if (percent >= 50) {
        rank = 'GABUT MENENGAH 😅'
        desc = 'Lumayan gabut! Lu pura-pura sibuk, padahal lagi nungguin chat dari dia yang gak bakal dateng!'
        kegiatan = 'Ngetik panjang-panjang, terus dihapus lagi. Ulang 10x!'
        emoji = '😅'
    } else if (percent >= 30) {
        rank = 'SETENGAH SIBUK 📝'
        desc = 'Agak sibuk dikit! Tapi sibuk lu cuma sibuk mikirin "makan apa ya hari ini?"'
        kegiatan = 'Kerja 5 menit, rebahan 2 jam. Kerja lagi 5 menit!'
        emoji = '📝'
    } else if (percent >= 10) {
        rank = 'HAMPIR PRODUKTIF 💼'
        desc = 'Sibuk banget! Produktif! Tapi produktif lu cuma produktif ngomongin orang!'
        kegiatan = 'Nugas sambil dengerin lagu galau'
        emoji = '💼'
    } else {
        rank = 'MANUSIA LANGKA! 🦄'
        desc = 'GILA! LU GAK GABUT SAMA SEKALI! LU NGAPAIN DI BOT INI? BALIK KERJA SANA! LU SATU-SATU NYA MANUSIA RAJIN DI GRUP INI!'
        kegiatan = 'Kerja, belajar, olahraga, semua lu lakuin! Lu alien ya?'
        emoji = '🦄'
    }

    // STATUS HARI INI - BEDA-BEDA TIAP PERSEN!
    let statusList = [
        'Lagi rebahan sambil mikirin hidup',
        'Lagi pura-pura sibuk padahal gabut',
        'Lagi nungguin chat yang gak dateng-dateng',
        'Lagi scroll FYP sampe lupa waktu',
        'Lagi overthinking jam 2 pagi',
        'Lagi mager mandi dari pagi',
        'Lagi chat bot karena gak ada temen chat'
    ]
    let status = statusList[absHash % statusList.length]

    let tag = `@${mentioned.split('@')[0]}`
    let txt = `*${emoji} CEK GABUT - ${rank}*\n`
    txt += `──────────────────\n`
    txt += `👤 Target: ${tag}\n`
    txt += `📊 Gabut: *${percent}%*\n`
    txt += `[${bar}] ${percent}%\n`
    txt += `──────────────────\n`
    txt += `💬 *Kata Bot:*\n${desc}\n\n`
    txt += `🎯 *Kegiatan Gabut Lu Hari Ini:*\n> ${kegiatan}\n\n`
    txt += `📌 *Status Lu Sekarang:*\n> ${status}\n\n`
    txt += `──────────────────\n`
    txt += mentioned === m.sender
        ? `_Cek lagi besok, siapa tau udah tobat!_`
        : `_Tag dia biar tobat! Suruh kerja sana!_`

    await conn.sendMessage(m.chat, { text: txt, mentions: [mentioned] }, { quoted: m })
}

handler.help = ['cekgabut <@tag>']
handler.tags = ['fun']
handler.command = /^(cekgabut|gabut)$/i

export default handler
