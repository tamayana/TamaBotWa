let handler = async (m, { text, usedPrefix, command, RaplyGwe }) => {
    if (!text) return RaplyGwe(`Contoh: *${usedPrefix + command} 10+5*2*\n\nContoh lain:\n*${usedPrefix + command} (100-20)/4*\n*${usedPrefix + command} 2^10*`)

    // Cuma boleh angka dan operator, biar gak bisa di-hack
    let expr = text.replace(/x/g, '*').replace(/÷/g, '/').replace(/,/g, '.').trim()

    if (!/^[0-9+\-*/().^% ]+$/.test(expr)) {
        return RaplyGwe(`❌ *Cuma boleh angka dan + - * / ( ) ^ % aja bung!*`)
    }

    try {
        // Ubah ^ jadi ** biar bisa pangkat
        let cleanExpr = expr.replace(/\^/g, '**').replace(/%/g, '/100')

        // Hitung dengan aman
        let result = Function(`"use strict"; return (${cleanExpr})`)()

        if (result === undefined || result === null || !isFinite(result)) {
            throw new Error('Hasil tidak valid')
        }

        // Biar rapi, kalo desimal kepanjangan dipotong
        let formatted = Number.isInteger(result) ? result.toLocaleString('id-ID') : parseFloat(result.toFixed(6)).toLocaleString('id-ID')

        await RaplyGwe(`「 *KALKULATOR* 」\n\n*Soal:* \`${expr}\`\n*Hasil:* \`${formatted}\``)

    } catch (e) {
        return RaplyGwe(`❌ *Soal lu salah bung! Coba cek lagi!*\nContoh: *${usedPrefix + command} 10+5*2*`)
    }
}

handler.help = ['kalkulator <soal>']
handler.tags = ['tools']
handler.command = /^(kalkulator|kalku|calc)$/i

export default handler
