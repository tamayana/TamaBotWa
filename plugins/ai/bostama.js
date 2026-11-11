// plugins/ai/bostama.js - BOSTAMA FULL FINAL! TANPA API! TANPA APIKEY!
let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    let isImage = /image/.test(mime)

    // ===== ROASTING FOTO =====
    if (isImage) {
        try {
            await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } })
            let roastFoto = [
                `JIR! Ini foto apa KTP? Muka lu kok kayak foto 3x4 yang gagal? 😒 Cahaya nya gelap, muka lu gelap, masa depan lu juga gelap!`,
                `Dih, ini lu? Gua kira filter IG yang rusak! Ternyata muka lu emang gitu ya? 🤣 Saran gua: jangan pake kamera depan, pake CCTV aja, biar jauh dikit!`,
                `Anjir! Pose lu kenapa gitu? Kayak orang lagi nahan berak tapi sok cool! 💀 Udah lah, hapus aja foto nya, sayang memori HP!`,
                `Woy! Ini foto lu apa foto tersangka? Kok muka lu tegang banget? Santai dikit lah! Senyum! Tapi jangan senyum juga, nanti tambah serem! 🥱`,
                `Gila! Lu foto pake HP apa pake kalkulator? Burik banget! Muka lu aja udah burik, ditambah kamera burik, lengkap sudah! 🔥`,
                `Halah, sok-sokan aesthetic! Padahal background nya kasur berantakan, baju numpuk, kipas angin debuan! Beresin kamar dulu baru sok foto-foto! 🖕`,
                `Ini filter apa? Filter "biar keliatan ganteng"? Gagal total! Filter nya nyerah liat muka lu! 😂`,
                `Jir, muka lu kok kayak orang baru bangun tapi belum mandi 3 hari? Minyak nya sampe bisa buat goreng tempe! Mandi sana woy! 💀`,
                `Pose 2 jari? Tahun berapa ini? 2015? Udah basi woy! Ganti pose kek, pose orang sukses! Bukan pose bocil baru punya HP! 😒`,
                `Dih, lu ngirim foto ini buat di-roasting apa buat nakut-nakutin gua? Gua aja kaget liatnya! Hampir gua banting HP! 🤣`,
                `SPILL! Ini lu abis begadang 3 hari ya? Mata panda nya sampe kalahin panda beneran! Tidur woy! Jangan scroll TikTok mulu!`,
                `Aura lu minus banget jir! Foto nya aja bikin HP gua nge-lag! Coba foto ulang, tapi jangan pake muka lu yang ini! Pake muka yang lain!`,
                `RIZZ LU MANA? Ini foto tuh rizz nya -1000! Cewek liat ini langsung ilfeel! Coba belajar pose dulu di TikTok!`,
                `Skibidi banget muka lu! Sigma? Sigma apaan? Lu tuh alpha nya aja gak ada! Beta aja masih ketinggian buat lu! 💀`,
                `Woy, ini foto lu apa foto meme? Kok gua ngakak liatnya? Lu cocok jadi meme "bocil ngantuk"! Viral tuh!`
            ]
            let pick = roastFoto[Math.floor(Math.random() * roastFoto.length)]
            let imgBuffer = await q.download()
            await conn.sendMessage(m.chat, { image: imgBuffer, caption: `*🔥 BOSTAMA ROASTING:*\n\n${pick}\n\n_Man makan man haa makan lah man🤝_` }, { quoted: m })
            return
        } catch (e) { console.log(e) }
    }

    if (!text) {
        let arr = [
            `Eh? Kosong? Lu ngetik .bostama doang? Otak lu juga kosong ya? 😒 Ketik gini: *.bostama kenapa gua jomblo?*`,
            `Woy! Mau nanya apa? Jangan cuma .bostama doang! Gua bukan dukun bisa baca pikiran lu! 🖕`,
            `Dih, nanya kok kosong? Sama kayak otak lu ya? Kosong? Ketik pertanyaan nya woy! 😒`,
            `Bro, lu ngetik .bostama doang terus ngarep gua jawab? Lu kira gua cenayang? Spill pertanyaan nya!`,
            `Halah, .bostama doang? Ngetik nya aja mager, gimana mau dapet pacar? Ketik yang lengkap woy!`
        ]
        return conn.sendMessage(m.chat, { text: arr[Math.floor(Math.random() * arr.length)] }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '🖕', key: m.key } })
    let t = text.toLowerCase()
    let jawaban = ''

    // ===== 1. JOMBLO / PACAR =====
    if (t.includes('jomblo') || t.includes('pacar') || t.includes('cewek') || t.includes('cowok') || t.includes('gebetan') || t.includes('crush') || t.includes('doi')) {
        let arr = [
            `Yaelah, jomblo mulu! Lu ngaca gak? Tiap hari rebahan, chat cewek cuma "P" doang, terus ngarep punya pacar? Jir! Rizz lu mana? Rizz lu minus! Coba mandi dulu, potong rambut, terus chat dia yang bener!`,
            `Jomblo? Ya pantes! Lu aja kalo di-chat balesnya 3 hari kemudian! Siapa yang betah? Sok sibuk padahal gabut! Coba bales chat cepet dikit, jangan sok jual mahal! Lu bukan artis!`,
            `Dih, ngeluh jomblo tapi gak pernah usaha! Lu kira pacar jatuh dari langit? Spill dong usaha lu apa? Cuma nge-stalk doang kan? Ya pantes jomblo!`,
            `Bro, lu tuh bukan jomblo, lu tuh ditolak semesta! Tiap PDKT gagal mulu! Coba introspeksi! Jangan-jangan chat lu tuh kering banget kayak gurun!`,
            `Jomblo sampe sekarang? Fix, lu tuh punya aura "temen doang"! Semua cewek nganggep lu temen! Bukan cowok! Ganti strategi woy! Jangan jadi good boy mulu!`,
            `Woy, jomblo itu bukan nasib, itu pilihan! Pilihan lu yang mager! Coba keluar rumah! Nongkrong! Jangan di kamar mulu! Di kamar gak ada jodoh! Adanya kasur!`,
            `Lu nanya kenapa jomblo? Gua tanya balik, kapan terakhir lu mandi? Kapan terakhir lu potong kuku? Nah! Itu jawaban nya!`,
            `Anjir, lu jomblo tapi sok galau! Galau nya tuh galau halu! Pacar aja gak ada, tapi galau nya kayak abis putus 5 tahun! Halu banget lu!`,
            `Gua spill ya! Cewek tuh suka cowok yang confident! Bukan cowok yang tiap hari ngomong "aku gak pantes buat kamu"! Cringe banget! PeDe dikit lah!`,
            `Udah lah, jomblo aja dulu! Daripada punya pacar tapi toxic! Mending jomblo tapi happy! Daripada pacaran tapi tiap hari berantem! Bener gak? Bener lah, gua kan bos!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 2. DUIT / KERJA / KAYA =====
    } else if (t.includes('duit') || t.includes('uang') || t.includes('kaya') || t.includes('miskin') || t.includes('kerja') || t.includes('gaji') || t.includes('cuan')) {
        let arr = [
            `Kerja lah woy! Lu kira duit jatuh dari langit? Gua aja kerja! Jualan kek, ngonten kek, jangan rebahan nungguin giveaway! Bangun!`,
            `Mau kaya tapi rebahan? Mimpi! Orang kaya aja kerja sampe malem, lu malah tidur sampe siang! Yaelah! Bangun, mandi, cari cuan!`,
            `Duit? Lu aja jajan masih minta ortu! Gimana mau kaya? Coba nabung dikit, jangan jajan boba mulu! Boba lu itu yang bikin miskin!`,
            `Spill! Gaji lu abis buat apa? Buat top up game kan? Buat skin kan? Pantes miskin! Skin lu banyak, tabungan lu 0!`,
            `Woy, mau cuan tapi gengsi? Gengsi tuh yang bikin lu miskin! Jualan online kek! Jadi afiliator kek! Jangan gengsi! Gengsi gak bisa dimakan!`,
            `Lu tuh bukan miskin, lu tuh boros! Baru gajian udah abis! Nongkrong mulu! Ngopi mulu! Ngopi 30rb tiap hari, sebulan 900rb! Mending buat nabung!`,
            `Cara dapet duit cepat? Kerja! Gak ada cara lain! Jangan percaya yang bilang "cuan 1 juta sehari tanpa kerja"! Itu penipuan! Lu mau ditipu?`,
            `Bro, lu tuh kalo disuruh kerja ngeluh, kalo gak ada duit ngeluh! Maunya apa? Maunya duit dateng sendiri? Lu kira lu anak sultan?`,
            `Jir, lu nanya cara kaya ke gua? Gua aja masih ngontrak! Tapi minimal gua usaha! Lu? Usaha aja enggak! Cuma ngeluh!`,
            `Udah lah, jangan sok kaya! Jadi diri sendiri aja! Yang penting jujur! Jangan flexing padahal pinjol! Malu-maluin!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 3. MINTA DUIT / PINJAM DUIT =====
    } else if (t.includes('minta duit') || t.includes('minta uang') || t.includes('bagi duit') || t.includes('bagi uang') || t.includes('pinjam duit') || t.includes('pinjam uang') || t.includes('minta dana') || t.includes('transfer') || t.includes('kirim duit')) {
        let arr = [
            `Minta duit? Enak aja! Lu kira gua ATM berjalan? Gua aja saldo nya 0! 0! Mau gua transfer apa? Transfer doa?`,
            `Dih, minta duit ke bot? Lu tuh udah putus asa banget ya? Sampe-sampe minta ke bot! Bot aja gak punya duit! Apalagi gua!`,
            `Pinjam duit? Pinjam 100rb, bayar nya 100 tahun kemudian? Modus lu udah ketebak! Gak bakal gua kasih!`,
            `Woy, minta duit mulu! Kerja lah! Jangan minta-minta! Lu kira gua sultan? Gua aja makan masih pake garam doang!`,
            `Spill! Lu minta duit buat apa? Buat top up kan? Buat skin kan? Pantes miskin! Skin lu banyak, tabungan lu 0! Gak gua kasih!`,
            `Bagi duit dong? Bagi apaan? Bagi penderitaan? Nih gua bagi penderitaan gua! Mau? Duit mah enggak ada!`,
            `Anjir, lu minta duit ke gua, gua minta duit ke siapa? Ke lu? Lu aja miskin! Kita tuh sama-sama miskin! Saling mengerti aja lah!`,
            `Transfer? Transfer apa? Transfer pemain bola? Lu kira gua manager MU? Gak ada duit woy!`,
            `Bro, lu tuh kalo minta duit cepet banget! Giliran disuruh bayar utang, ilang! Hilang ditelan bumi! Utang lu yang dulu aja belum lunas!`,
            `Minta dana? Dana apaan? Dana bansos? Lu bukan anak bansos! Lu anak rebahan! Gak dapet!`,
            `Udah lah, jangan minta duit! Mending gua kasih nasihat: KERJA! Kerja tuh yang bikin lu punya duit! Bukan minta-minta!`,
            `Gua kasih duit? Boleh! Syarat nya 1: Lu kerja dulu buat gua! Cuci piring, sapu rumah, mandiin kucing! Mau? Enggak kan? Yaudah, gak jadi!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 4. SEDIH / GALAU / PUTUS =====
    } else if (t.includes('sedih') || t.includes('galau') || t.includes('nangis') || t.includes('patah hati') || t.includes('ditinggal') || t.includes('putus') || t.includes('sakit hati')) {
        let arr = [
            `Dih, sedih mulu! Dia aja udah happy sama yang baru, lu masih nangis? Nangis 5 menit aja, abis itu mandi, makan, move on! Jangan jadi sinetron berjalan!`,
            `Yaelah galau mulu! Hidup emang gitu man! Nangis boleh, tapi jangan lebay! Bangun, mandi, makan! Gua temenin kok, tapi jangan drama mulu!`,
            `Putus? Ya udah! Berarti dia bukan jodoh lu! Jangan dikejar! Yang pergi biar pergi, yang dateng nanti lebih bagus! Udah, jangan nangis! Bau lu!`,
            `Bro, lu galau karena siapa? Yang udah gak peduli sama lu? Ngapain lu peduliin orang yang gak peduliin lu? Rugi! Move on woy!`,
            `Nangis mulu! Mata lu bengkak tuh! Nanti dikira abis begadang! Padahal abis nangisin orang yang gak pantes ditangisin!`,
            `Sakit hati? Yaelah, semua orang pernah! Gua juga pernah! Tapi gua gak lebay kayak lu! Gua nangis semalem, besoknya udah nongkrong lagi! Gitu dong!`,
            `Lu tuh galau nya tuh halu! Pacaran aja baru seminggu, galau nya kayak 7 tahun! Lebay banget! Udah, hapus foto nya, blokir, move on!`,
            `Woy, dengerin gua! Lu tuh berharga! Jangan nangisin orang yang gak ngargain lu! Lu pantas dapet yang lebih baik! Yang sayang lu! Bukan yang nyakitin lu!`,
            `Galau? Coba makan! Makan tuh obat galau paling ampuh! Man makan man haa makan lah man🤝 Abis makan, tidur! Besok bangun udah lupa!`,
            `Udah lah, jangan sedih! Sedih tuh bikin muka lu jelek! Lu aja udah jelek, ditambah sedih, lengkap! Mending senyum! Senyum tuh bikin lu keliatan ganteng dikit!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 5. LAPAR / MAKAN =====
    } else if (t.includes('lapar') || t.includes('laper') || t.includes('makan') || t.includes('perut') || t.includes('pengen makan') || t.includes('hungry')) {
        let arr = [
            `Lapar? Ya makan lah woy! Ngapain nanya ke gua? Gua bukan GoFood! Buka kulkas! Kalo kulkas kosong, ya masak! Kalo gak bisa masak, ya order! Jangan nanya mulu!`,
            `Jir, lapar doang nanya ke bot? Lu tuh mager nya udah level dewa! Bangun! Ke dapur! Ambil piring! Makan! Man makan man haa makan lah man🤝`,
            `Lapar? Sama! Gua juga lapar! Tapi gua gak ngeluh kayak lu! Gua langsung makan! Lu? Malah chat bot! Makan woy!`,
            `Dih, lapar? Perut lu bunyi ya? Bunyi nya sampe sini kedengeran! "Kruk kruk kruk"! Makan sana! Jangan sampe pingsan!`,
            `Woy, lu lapar karena apa? Karena gak sarapan kan? Pantes! Sarapan tuh penting! Jangan skip sarapan! Sarapan dulu baru ngeluh!`,
            `Spill! Lu lapar tapi mager masak kan? Ngaku aja! Mager masak, mager beli, mager semuanya! Maunya disuapin? Manja banget lu!`,
            `Laper? Coba minum dulu! Kadang lapar tuh cuma haus! Kalo abis minum masih lapar, ya makan! Jangan sok diet! Diet lu gagal mulu!`,
            `Bro, lu tuh tiap jam lapar! Baru makan sejam yang lalu, udah lapar lagi! Lu tuh perut nya perut karet ya? Melar mulu!`,
            `Makan apa? Terserah! Yang penting makan! Jangan tanya "makan apa ya?" ke gua! Gua bukan emak lu! Buka kulkas, apa yang ada, makan!`,
            `Udah lah, jangan lapar-laparan! Makan yang banyak! Biar gemuk dikit! Biar gak dikira kurang gizi! Makan! Makan! Makan! 🤝`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 6. SEKOLAH / KULIAH / NUGAS =====
    } else if (t.includes('sekolah') || t.includes('kuliah') || t.includes('tugas') || t.includes('nugas') || t.includes('ujian') || t.includes('belajar') || t.includes('skripsi')) {
        let arr = [
            `Nugas? Ya nugas lah! Jangan nanya ke gua! Gua aja dulu nugas SKS! Sistem Kebut Semalam! Lu juga gitu kan? Ngaku aja!`,
            `Belajar? Lu tuh kalo disuruh belajar ngantuk, kalo disuruh main game melek sampe pagi! Otak lu tuh kebalik!`,
            `Skripsi? Woy, skripsi tuh dikerjain, bukan ditangisin! Nangis gak bikin skripsi kelar! Yang bikin kelar tuh ngetik! Ngetik woy!`,
            `Ujian? Belajar lah! Jangan ngarep contekan! Contekan tuh buat orang yang gak belajar! Lu belajar gak? Enggak kan? Pantes panik!`,
            `Bro, lu tuh sekolah buat apa? Buat tidur di kelas? Guru nerangin, lu tidur! Pantes gak ngerti!`,
            `Tugas numpuk? Yaelah, numpuk karena lu tunda-tunda! Kalo dari awal dikerjain, gak bakal numpuk! Jangan deadline-er mulu!`,
            `Kuliah? Kuliah tuh mahal woy! Ortu lu banting tulang buat bayarin! Lu malah bolos! Dosa lu!`,
            `Lu nanya cara biar pinter? Belajar! Gak ada cara lain! Jangan percaya yang jual "pil pinter"! Itu bohong!`,
            `Woy, jangan sok sibuk! Sibuk lu tuh sibuk main HP di kelas! Sok sibuk padahal gabut!`,
            `Udah lah, kerjain tugas lu! Jangan chat bot mulu! Bot aja kerja, masa lu enggak?`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 7. GAME / ML / FF =====
    } else if (t.includes('game') || t.includes('ml') || t.includes('mobile legends') || t.includes('ff') || t.includes('free fire') || t.includes('roblox') || t.includes('rank') || t.includes('mabar')) {
        let arr = [
            `Mabar? Mabar apaan? Rank lu aja masih Epic! Sok-sokan ngajak mabar! Naikin rank dulu sana! Jangan beban!`,
            `Lu main ML tapi feeder mulu! Tiap war mati duluan! Terus nyalahin temen! Ngaca woy! Lu yang beban!`,
            `Game mulu! Tugas lu gimana? Tugas lu udah kelar? Belum kan? Pantes! Main game mulu!`,
            `Woy, lu tuh kalo main game jago, kalo disuruh belajar bego! Otak lu tuh cuma buat game doang ya?`,
            `Top up mulu! Duit jajan abis buat top up! Skin banyak, skill 0! Buat apa skin bagus kalo main nya beban?`,
            `Mabar yuk? Yuk! Tapi jangan nangis kalo kalah! Kalah tuh biasa! Yang gak biasa tuh lu yang ngamuk-ngamuk kalo kalah!`,
            `Rank lu stuck? Ya pantes! Lu main nya solo, tapi egois! Main tuh teamwork! Bukan sok jago sendiri!`,
            `Bro, lu tuh main game sampe lupa makan! Makan woy! Man makan man haa makan lah man🤝 Jangan game mulu!`,
            `FF? ML? Roblox? Semua lu mainin! Tapi pelajaran 1 pun gak ada yang lu kuasai! Gimana sih lu?`,
            `Udah lah, jangan main game mulu! Sekali-sekali keluar rumah! Liat dunia nyata! Dunia nyata lebih seru dari game!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 8. ROASTING / GANTENG / RIZZ =====
    } else if (t.includes('cantik') || t.includes('ganteng') || t.includes('jelek') || t.includes('roasting') || t.includes('hina') || t.includes('jelekin') || t.includes('rizz')) {
        let arr = [
            `Lu minta di-roasting? Berani lu! Muka lu tuh kayak WiFi lemot, susah dicari, gampang ilang! Udah lah, ngaca dulu sana!`,
            `Jelek? Lu tuh bukan jelek, lu tuh unik! Unik nya tuh orang liat lu langsung kaget! 🤣`,
            `Ganteng? Lu? Gua aja kaget dengernya! Lu tuh ganteng nya cuma di KTP doang! Di dunia nyata... ya gitu lah!`,
            `Rizz lu? Rizz lu minus! Cewek liat lu langsung ilfeel! Coba belajar ngomong dulu! Jangan kaku!`,
            `Aura lu minus banget jir! Aura nya tuh aura bocil! Bukan aura cowok cool! Ganti aura woy!`,
            `Lu tuh kalo jadi meme, meme nya tuh meme "bocil ngantuk"! Cocok banget! Viral tuh!`,
            `Spill! Lu tuh cantik nya tuh cantik pas foto nya dihapus! Pas foto nya ada, ya... gitu lah!`,
            `Sigma? Sigma apaan? Lu tuh alpha nya aja gak ada! Beta aja masih ketinggian buat lu! 💀`,
            `Skibidi banget lu! Muka lu tuh skibidi toilet! Bikin orang mual!`,
            `Woy, lu tuh ganteng nya tuh ganteng pas mati lampu! Pas lampu nyala, ya ampun!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]

    // ===== 9. FITUR BARU: KALO GAK ADA DI KATEGORI MANA-MANA! =====
    } else {
        let arr = [
            `Jangan nanya gua! Mikir sendiri bujang! 🖕 Lu punya otak kan? Pake lah! Jangan nanya mulu!`,
            `Dih, "${text}"? Apaan tuh? Jangan nanya gua! Mikir sendiri bujang! 🖕 Otak lu jangan dipake buat scroll TikTok doang!`,
            `Woy, gua gak tau "${text}" itu apa! Jangan nanya gua! Mikir sendiri bujang! 🖕 Google ada! Otak lu ada! Pake!`,
            `Halah, nanya "${text}" ke gua? Gua bukan Google! Jangan nanya gua! Mikir sendiri bujang! 🖕`,
            `Bro, "${text}"? Lu nanya yang aneh-aneh mulu! Jangan nanya gua! Mikir sendiri bujang! 🖕 Capek gua jawab mulu!`,
            `Jangan nanya gua mikir sendiri bujang! 🖕 Lu kira gua pembantu lu? Nanya mulu! Mikir lah sekali-sekali!`,
            `Eh, "${text}"? Gua mana tau! Jangan nanya gua! Mikir sendiri bujang! 🖕 Lu sekolah buat apa kalo nanya mulu?`,
            `Anjir, nanya mulu lu! "${text}" aja ditanya! Jangan nanya gua! Mikir sendiri bujang! 🖕 Kalo gak tau, cari sendiri!`,
            `Udah lah, jangan nanya gua! Mikir sendiri bujang! 🖕 Gua mau nongkrong! Jangan ganggu!`,
            `Spill! Lu tuh nanya "${text}" karena mager mikir kan? Ngaku aja! Jangan nanya gua! Mikir sendiri bujang! 🖕 Mager mulu!`
        ]
        jawaban = arr[Math.floor(Math.random() * arr.length)]
    }

    let closingList = [`\n\n_Udah sana kerja, jangan gabut mulu!_`, `\n\n_Man makan man haa makan lah man🤝_`, `\n\n_Bubar! Bubar! Gua mau nongkrong!_`, `\n\n_Jangan nanya yang aneh-aneh lagi!_`, `\n\n_Spill ke temen lu, suruh nanya juga!_`]
    let closing = closingList[Math.floor(Math.random() * closingList.length)]

    await conn.sendMessage(m.chat, { text: `*😒 BOSTAMA:*\n\n${jawaban}${closing}` }, { quoted: m })
}

handler.help = ['bostama <pertanyaan> / roasting foto']
handler.tags = ['ai']
handler.command = /^(bostama|tama)$/i

export default handler
