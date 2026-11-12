if (!global.tebakata) global.tebakata = {}

let handler = async (m, { conn }) => {
    if (global.tebakata[m.chat]) return m.reply('Eits masih ada soal yang belum kelar njir! Jawab dulu! 😤')

    let soalList = [
        { jawab: 'PERPUSTAKAAN', clue: 'Tempat pinjem buku, sepi, gak boleh berisik' },
        { jawab: 'OVERTHINKING', clue: 'Kebanyakan mikir sampe gak bisa tidur, gara-gara chat doi' },
        { jawab: 'KECAMATAN', clue: 'Wilayah di bawah kabupaten' },
        { jawab: 'PERCINTAAN', clue: 'Urusan hati, cinta-cintaan, bucin-bucinan' },
        { jawab: 'TONGKRONGAN', clue: 'Tempat nongkrong anak muda, biasanya di warkop' },
        { jawab: 'KELAPARAN', clue: 'Laper banget sampe perut bunyi, pengen makan seblak' },
        { jawab: 'PENDIDIKAN', clue: 'Urusan sekolah / kuliah' },
        { jawab: 'PERJUANGAN', clue: 'Usaha keras buat dapetin sesuatu, misal dapetin dia' },
        { jawab: 'KEMERDEKAAN', clue: '17 Agustus, merdeka!' },
        { jawab: 'INSECURE', clue: 'Ngerasa gak pede, ngerasa kalah sama orang lain' },
        { jawab: 'GHOSTING', clue: 'Tiba-tiba ilang tanpa kabar, padahal kemarin sayang-sayangan' },
        { jawab: 'BUCINPARAH', clue: 'Level bucin paling atas, udah gak bisa ditolong' },
        { jawab: 'HEALING', clue: 'Pergi liburan biar gak stres, pulang-pulang dompet kering' },
        { jawab: 'KELUARGA', clue: 'Bapak, ibu, kakak, adek, satu rumah' },
        { jawab: 'PERSAHABATAN', clue: 'Hubungan temen yang udah kaya saudara' },
        { jawab: 'KECEWA', clue: 'Perasaan pas harapan gak sesuai kenyataan, sakit tapi gak berdarah' },
        { jawab: 'CEMBURU', clue: 'Perasaan gak rela liat ayang deket sama orang lain' },
        { jawab: 'SINGLE', clue: 'Jomblo, gak punya pacar, tapi sok bahagia' },
        { jawab: 'JOMBLO', clue: 'Gak punya ayang, tiap malem minggu di rumah doang' },
        { jawab: 'MANTAN', clue: 'Orang yang dulu sayang, sekarang jadi asing' },
        { jawab: 'GEBETAN', clue: 'Orang yang lagi diincer buat dijadiin pacar' },
        { jawab: 'PDKT', clue: 'Proses pendekatan ke gebetan, masa-masa deg-degan' },
        { jawab: 'DITOLAK', clue: 'Nembak tapi gagal, sakitnya tuh disini' },
        { jawab: 'DITERIMA', clue: 'Nembak berhasil, langsung jadian, auto pamer' },
        { jawab: 'SELINGKUH', clue: 'Punya pacar tapi masih main sama yang lain, dosa!' },
        { jawab: 'PUTUS', clue: 'Hubungan berakhir, udahan, bubar jalan' },
        { jawab: 'BALIKAN', clue: 'Putus terus jadian lagi, putus lagi, jadian lagi' },
        { jawab: 'KANGEN', clue: 'Rindu berat, pengen ketemu ayang terus' },
        { jawab: 'RINDU', clue: 'Kangen, pengen ketemu' },
        { jawab: 'CINTA', clue: 'Perasaan sayang banget ke seseorang' },
        { jawab: 'SAYANG', clue: 'Perasaan peduli banget ke ayang' },
        { jawab: 'MARAH', clue: 'Emosi, pengen banting HP gara-gara di read doang' },
        { jawab: 'KESEL', clue: 'Kesal, sebel, pengen marah tapi ditahan' },
        { jawab: 'SEBEL', clue: 'Bete, kesel liat tingkah doi' },
        { jawab: 'BAPER', clue: 'Bawa perasaan, dikit-dikit nangis' },
        { jawab: 'GALAU', clue: 'Sedih gara-gara cinta, denger lagu galau terus' },
        { jawab: 'SENANG', clue: 'Bahagia, senyum-senyum sendiri liat chat doi' },
        { jawab: 'BAHAGIA', clue: 'Perasaan seneng banget, pengen joget' },
        { jawab: 'SEDIH', clue: 'Nangis, murung, gara-gara putus' },
        { jawab: 'TAKUT', clue: 'Ngeri, deg-degan pas mau nembak' },
        { jawab: 'MALU', clue: 'Merah mukanya pas ketemu gebetan' },
        { jawab: 'GEMES', clue: 'Gemas, pengen cubit pipi ayang' },
        { jawab: 'GEMOY', clue: 'Lucu banget, gemes, pengen dicubit' },
        { jawab: 'SLEBEW', clue: 'Kata viral buat godaan, slebewww~' },
        { jawab: 'GACOR', clue: 'Lagi hoki parah, lagi bagus banget' },
        { jawab: 'SPILL', clue: 'Bongkar rahasia, "spill dong!"' },
        { jawab: 'VIBES', clue: 'Suasana, aura, "vibes nya enak banget"' },
        { jawab: 'CRINGE', clue: 'Jijik, malu-maluin, "cringe banget sih"' },
        { jawab: 'SKIBIDI', clue: 'Kata viral dari tiktok, skibidi toilet' },
        { jawab: 'RIZZ', clue: 'Skill gombal, skill pdkt' },
        { jawab: 'SIGMA', clue: 'Cowok sok cool, sok misterius, jalan sendiri' },
        { jawab: 'OHIO', clue: 'Meme, "only in ohio", aneh-aneh' },
        { jawab: 'NGABERS', clue: 'Anak motor yang suka geber-geber, knalpot brong' },
        { jawab: 'ANAKMOTOR', clue: 'Suka touring, suka geber, suka nongkrong di SPBU' },
        { jawab: 'WARKOP', clue: 'Warung kopi, tempat tongkrongan anak muda' },
        { jawab: 'SEBLAK', clue: 'Makanan pedes dari Bandung, level pedesnya gak ngotak' },
        { jawab: 'CILOK', clue: 'Jajanan bulat-bulat, pake saos kacang' },
        { jawab: 'CIMOL', clue: 'Jajanan bulat, digoreng, gurih' },
        { jawab: 'BASRENG', clue: 'Basreng, bakso goreng, pedesnya nampol' },
        { jawab: 'MIEAYAM', clue: 'Mie pake ayam, pake bakso, pake saos' },
        { jawab: 'BAKSO', clue: 'Bola daging, pake kuah, pake mie' },
        { jawab: 'SATE', clue: 'Daging ditusuk, dibakar, pake bumbu kacang' },
        { jawab: 'NASIUDUK', clue: 'Nasi gurih, pake ayam goreng, pake sambel' },
        { jawab: 'NASI PADANG', clue: 'Nasi + rendang, masakan Padang, juara' },
        { jawab: 'RENDANG', clue: 'Daging masak santan, makanan terenak di dunia' },
        { jawab: 'GORENGAN', clue: 'Tempe goreng, tahu goreng, bakwan, enak pas hujan' },
        { jawab: 'ES TEH', clue: 'Minuman manis, dingin, temennya gorengan' },
        { jawab: 'KOPI SUSU', clue: 'Kopi + susu, minuman anak tongkrongan' },
        { jawab: 'BOBA', clue: 'Minuman ada bulat-bulat kenyal, manis' },
        { jawab: 'MATCHA', clue: 'Teh hijau dari Jepang, pahit tapi enak' },
        { jawab: 'SEPAKBOLA', clue: 'Olahraga 22 orang, rebutan bola, ada gawang' },
        { jawab: 'BASKET', clue: 'Olahraga masukin bola ke keranjang' },
        { jawab: 'VOLI', clue: 'Olahraga pake net, smash-smashan' },
        { jawab: 'BADMINTON', clue: 'Olahraga pake raket, pake kok, Indonesia jago' },
        { jawab: 'RENANG', clue: 'Olahraga di air, gaya bebas, gaya katak' },
        { jawab: 'LARI', clue: 'Olahraga kaki, cepet-cepetan' },
        { jawab: 'GYM', clue: 'Tempat olahraga, angkat beban, biar badan bagus' },
        { jawab: 'SEKOLAH', clue: 'Tempat belajar, ada guru, ada murid' },
        { jawab: 'KULIAH', clue: 'Belajar di universitas, banyak tugas, banyak drama' },
        { jawab: 'KAMPUS', clue: 'Tempat kuliah, banyak gedung, banyak gebetan' },
        { jawab: 'DOSEN', clue: 'Guru nya anak kuliah, killer kadang' },
        { jawab: 'GURU', clue: 'Yang ngajarin di sekolah' },
        { jawab: 'MURID', clue: 'Yang belajar di sekolah' },
        { jawab: 'KELAS', clue: 'Ruangan belajar, ada meja kursi' },
        { jawab: 'UJIAN', clue: 'Tes, ulangan, bikin deg-degan' },
        { jawab: 'TUGAS', clue: 'PR, kerjaan dari guru / dosen, numpuk' },
        { jawab: 'RAPORT', clue: 'Nilai hasil belajar, dibagi tiap semester' },
        { jawab: 'WISUDA', clue: 'Lulus kuliah, pake toga, foto-foto' },
        { jawab: 'KERJA', clue: 'Cari duit, ngantor, gajian' },
        { jawab: 'GAJIAN', clue: 'Dapet duit, langsung abis buat bayar ini itu' },
        { jawab: 'KANTOR', clue: 'Tempat kerja, ada bos, ada lembur' },
        { jawab: 'BOS', clue: 'Atasan di kantor, yang suka nyuruh-nyuruh' },
        { jawab: 'LEMBUR', clue: 'Kerja sampe malem, gak pulang-pulang' },
        { jawab: 'CUTI', clue: 'Libur dari kerja, healing' },
        { jawab: 'LIBURAN', clue: 'Jalan-jalan, healing, ke pantai / gunung' },
        { jawab: 'PANTAI', clue: 'Tempat ada pasir, ada laut, ada sunset' },
        { jawab: 'GUNUNG', clue: 'Tempat tinggi, dingin, buat hiking' },
        { jawab: 'HIKING', clue: 'Naik gunung, jalan kaki jauh' },
        { jawab: 'CAMPING', clue: 'Tidur di tenda, di alam, bakar-bakar' },
        { jawab: 'NONTON', clue: 'Lihat film, di bioskop / di HP' },
        { jawab: 'BIOSKOP', clue: 'Tempat nonton film, ada popcorn' },
        { jawab: 'FILM', clue: 'Tontonan, ada drama, ada horor' },
        { jawab: 'DRAMA', clue: 'Cerita sedih, nangis-nangis, sinetron' },
        { jawab: 'HOROR', clue: 'Film serem, hantu-hantuan' },
        { jawab: 'KOMEDI', clue: 'Film lucu, bikin ngakak' },
        { jawab: 'LAGU', clue: 'Musik, dinyanyiin, ada lirik' },
        { jawab: 'MUSIK', clue: 'Dengerin lagu, pake headset' },
        { jawab: 'KARAOKE', clue: 'Nyanyi-nyanyi, pake mic, di room' },
        { jawab: 'TIKTOK', clue: 'Aplikasi video pendek, joget-joget, fyp' },
        { jawab: 'INSTAGRAM', clue: 'Aplikasi foto, story, reels, DM ayang' },
        { jawab: 'WHATSAPP', clue: 'Aplikasi chat, buat chat ayang' },
        { jawab: 'YOUTUBE', clue: 'Aplikasi nonton video, ada iklan' },
        { jawab: 'GAME', clue: 'Mainan di HP / PC, mabar sama temen' },
        { jawab: 'MABAR', clue: 'Main bareng, main game sama temen' },
        { jawab: 'MOBILELEGENDS', clue: 'Game 5 vs 5, push rank, mabar' },
        { jawab: 'FREEFIRE', clue: 'Game battle royale, booyah!' },
        { jawab: 'PUBG', clue: 'Game battle royale, winner winner chicken dinner' },
        { jawab: 'MINECRAFT', clue: 'Game kotak-kotak, bangun-bangun rumah' },
        { jawab: 'ROBLOX', clue: 'Game banyak mode, main sama bocil' },
        { jawab: 'HAPE', clue: 'Handphone, buat chat, buat scroll' },
        { jawab: 'LAPTOP', clue: 'Komputer jinjing, buat tugas / game' },
        { jawab: 'INTERNET', clue: 'Buat browsing, buat scroll, buat mabar' },
        { jawab: 'WIFI', clue: 'Internet tanpa kabel, rebutan pasword' },
        { jawab: 'KUOTA', clue: 'Paket internet, kalo abis gabut' },
        { jawab: 'PULSA', clue: 'Buat isi HP, buat beli kuota' },
        { jawab: 'DOMPET', clue: 'Tempat nyimpen duit, sering kosong' },
        { jawab: 'UANG', clue: 'Duit, buat jajan, buat healing' },
        { jawab: 'JAJAN', clue: 'Beli makanan, beli seblak, beli cilok' },
        { jawab: 'NONGKRONG', clue: 'Kumpul sama temen, ngobrol, ngopi' },
        { jawab: 'CURHAT', clue: 'Cerita masalah ke temen, curhatin ayang' },
        { jawab: 'DIAM', clue: 'Gak ngomong, silent treatment' },
        { jawab: 'KABUR', clue: 'Pergi diam-diam, lari dari masalah' }
    ]

    let pilih = soalList[Math.floor(Math.random() * soalList.length)]
    let jawaban = pilih.jawab

    // SEMBUNYIIN 1/3 HURUF NYA PAKE *
    let huruf = jawaban.split('')
    let jumlahSembunyi = Math.floor(jawaban.length / 3) + 1
    let indexSembunyi = []
    while (indexSembunyi.length < jumlahSembunyi) {
        let r = Math.floor(Math.random() * huruf.length)
        if (!indexSembunyi.includes(r)) indexSembunyi.push(r)
    }
    let soal = huruf.map((h, i) => indexSembunyi.includes(i) ? '*' : h).join(' - ')

    global.tebakata[m.chat] = {
        jawaban: jawaban.toLowerCase(),
        timeout: setTimeout(() => {
            conn.sendMessage(m.chat, { text: `Waduh waktu habis! Jawabannya *${jawaban}*! Padahal udah dikasih clue ${soal}! Skill issue dikit gak ngaruh, gas lagi! 🥲` })
            delete global.tebakata[m.chat]
        }, 60000)
    }

    await conn.sendMessage(m.chat, {
        text: `🎮 *TEBAK KATA ALA GEN Z!*\n\nTebak kata ini bestie, jangan ngasal!\n\n*${soal}*\n\nClue: *${pilih.clue}*\nKata nya ${jawaban.length} huruf!\n\n60 detik! Spill jawaban lu!`
    })
}

handler.before = async (m, { conn }) => {
    if (!m.text || m.isBaileys) return
    if (!global.tebakata[m.chat]) return
    if (m.text.startsWith('.') || m.text.startsWith('!')) return
    let game = global.tebakata[m.chat]
    if (m.text.toLowerCase().trim() === game.jawaban) {
        clearTimeout(game.timeout)
        delete global.tebakata[m.chat]
        await conn.sendMessage(m.chat, { text: `✅ *GACOR BANGET LU!* Jawabannya emang *${game.jawaban.toUpperCase()}*! Otak lu encer parah! 🧠🔥` }, { quoted: m })
        return true
    }
    return true
}

handler.help = ['tebakata']
handler.tags = ['game']
handler.command = /^tebakata$/i
export default handler
