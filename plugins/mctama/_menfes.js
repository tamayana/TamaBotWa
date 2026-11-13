// plugins/_menfes.js - INI BUAT BALAS-BALASAN! WAJIB ADA _ DI DEPAN!
export default async function (m, { conn }) {
    // CUMA JALAN DI CHAT PRIBADI, BUKAN GRUP
    if (m.isGroup) return
    if (!m.text) return

    // KALO PESAN NYA COMMAND (PAKE . / ! / #), JANGAN DI FORWARD, BIARIN COMMAND NYA JALAN
    if (/^[.!/#]/.test(m.text.trim())) return

    if (!global.db.data.menfes) global.db.data.menfes = {}
    let pasangan = global.db.data.menfes[m.sender]
    if (!pasangan) return // KALO GAK LAGI MENFES, DIEM AJA

    // FORWARD KE PASANGAN!
    try {
        await conn.sendMessage(pasangan, {
            text: `💬 *Pengagum rahasiamu:*\n${m.text}\n\n────────────────\n_Bales aja chat ini buat bales dia!_`
        })
    } catch (e) {
        // KALO GAGAL, HAPUS PASANGAN
        delete global.db.data.menfes[m.sender]
        delete global.db.data.menfes[pasangan]
    }
}
