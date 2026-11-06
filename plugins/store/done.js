import { createCanvas } from '@napi-rs/canvas'
import config from '../../config.js'

function rupiah(n) {
    const x = Number(n || 0)
    return "Rp " + x.toLocaleString("id-ID")
}

function createReceipt(input = {}) {
    const sanitize = v => String(v ?? "").replace(/[<>]/g, "").trim()

    const dashed = (ctx, x1, x2, y) => {
        ctx.save()
        ctx.setLineDash([6, 8])
        ctx.lineWidth = 2
        ctx.strokeStyle = "#bdbdbd"
        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.stroke()
        ctx.restore()
    }

    const wrap = (ctx, text, maxWidth) => {
        const words = String(text || "").split(/\s+/)
        const lines = []
        let line = ""
        for (const w of words) {
            const t = line ? line + " " + w : w
            if (ctx.measureText(t).width <= maxWidth) line = t
            else {
                if (line) lines.push(line)
                line = w
            }
        }
        if (line) lines.push(line)
        return lines
    }

    const drawBarcode = (ctx, x, y, w, h) => {
        ctx.fillStyle = "#fff"
        ctx.fillRect(x, y, w, h)
        ctx.fillStyle = "#111"
        const bars = 120
        const gap = w / bars
        for (let i = 0; i < bars; i++) {
            const tall = (i % 9 === 0 || i % 13 === 0) ? 0.92 : 0.62
            const bw = (i % 5 === 0) ? 3 : 2
            const bh = h * tall
            ctx.fillRect(x + i * gap, y + (h - bh) / 2, bw, bh)
        }
    }

    const now = new Date()
    const tanggal = sanitize(input.tanggal || now.toLocaleDateString("id-ID"))
    const jam = sanitize(input.jam || now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))

    const nominal = Number(input.nominal || 0)
    const fee = Number(input.fee ?? 300)
    const total = nominal + fee

    const data = {
        trx: sanitize(input.trx || ("TRX-" + Date.now().toString().slice(-8))),
        status: sanitize(input.status || "BERHASIL"),
        metode: sanitize(input.metode || "QRIS"),
        username: sanitize(input.username || "User"),
        item: sanitize(input.item || "-"),
        nominal,
        fee,
        total,
        tanggal,
        jam
    }

    const W = 980
    const H = 1300
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "#f2f2f2"
    ctx.fillRect(0, 0, W, H)

    const cardX = 60
    const cardY = 50
    const cardW = W - 120
    const cardH = H - 100
    const r = 26

    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.moveTo(cardX + r, cardY)
    ctx.lineTo(cardX + cardW - r, cardY)
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r)
    ctx.lineTo(cardX + cardW, cardY + cardH - r)
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH)
    ctx.lineTo(cardX + r, cardY + cardH)
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r)
    ctx.lineTo(cardX, cardY + r)
    ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY)
    ctx.closePath()
    ctx.fill()

    const pad = 54
    const L = cardX + pad
    const R = cardX + cardW - pad
    const colLabel = L
    const colMid = L + 250
    const colRight = R

    let y = cardY + 70

    ctx.textAlign = "center"
    ctx.fillStyle = "#111"
    ctx.font = "bold 52px serif"
    ctx.fillText("BOT STORE", cardX + cardW / 2, y)
    y += 46

    ctx.font = "700 20px monospace"
    ctx.fillStyle = "#222"
    ctx.fillText("STRUK TRANSAKSI", cardX + cardW / 2, y)
    y += 34

    dashed(ctx, L, R, y)
    y += 52

    ctx.font = "700 18px monospace"
    ctx.fillStyle = "#111"

    const kv = (label, value) => {
        ctx.textAlign = "left"
        ctx.fillText(label, colLabel, y)
        ctx.textAlign = "right"
        ctx.fillText(value, colRight, y)
        y += 34
    }

    kv("NO TRX", data.trx)
    kv("STATUS", data.status)
    kv("TANGGAL", data.tanggal)
    kv("JAM", data.jam)

    y += 10
    dashed(ctx, L, R, y)
    y += 50

    ctx.textAlign = "left"
    ctx.font = "bold 20px monospace"
    ctx.fillStyle = "#111"
    ctx.fillText("INFORMASI PEMBELI", colLabel, y)
    y += 42

    ctx.font = "700 18px monospace"
    ctx.fillStyle = "#111"

    ctx.textAlign = "left"
    ctx.fillText("• Username :", colLabel, y)
    ctx.textAlign = "left"
    const uLines = wrap(ctx, data.username, (colRight - colMid) - 10)
    ctx.fillText(uLines[0] || "-", colMid, y)
    y += 36
    if (uLines[1]) {
        ctx.textAlign = "left"
        ctx.fillText(uLines[1], colMid, y)
        y += 36
    }

    y += 6
    dashed(ctx, L, R, y)
    y += 50

    ctx.textAlign = "left"
    ctx.font = "bold 20px monospace"
    ctx.fillStyle = "#111"
    ctx.fillText("ITEM", colLabel, y)
    y += 42

    ctx.font = "700 18px monospace"
    ctx.fillStyle = "#111"
    ctx.textAlign = "left"
    ctx.fillText("• Nama", colLabel, y)
    ctx.textAlign = "left"
    const iLines = wrap(ctx, data.item, (colRight - colMid) - 10)
    ctx.fillText(iLines[0] || "-", colMid, y)
    y += 36
    if (iLines[1]) {
        ctx.textAlign = "left"
        ctx.fillText(iLines[1], colMid, y)
        y += 36
    }

    y += 10
    dashed(ctx, L, R, y)
    y += 50

    ctx.textAlign = "left"
    ctx.font = "bold 20px monospace"
    ctx.fillStyle = "#111"
    ctx.fillText("INFORMASI TRANSAKSI", colLabel, y)
    y += 42

    ctx.font = "700 18px monospace"
    ctx.fillStyle = "#111"

    const moneyRow = (left, amt) => {
        ctx.textAlign = "left"
        ctx.fillText("• " + left, colLabel, y)
        ctx.textAlign = "left"
        ctx.fillText(amt, colMid, y)
        ctx.textAlign = "right"
        ctx.fillText(amt, colRight, y)
        y += 36
    }

    moneyRow("Nominal", rupiah(data.nominal))
    moneyRow("Biaya Admin", rupiah(data.fee))
    moneyRow("Total Bayar", rupiah(data.total))

    y += 10
    dashed(ctx, L, R, y)
    y += 46

    ctx.font = "700 18px monospace"
    ctx.fillStyle = "#111"

    ctx.textAlign = "left"
    ctx.fillText("Metode", colLabel, y)
    ctx.textAlign = "left"
    ctx.fillText(data.metode, colMid, y)
    ctx.textAlign = "right"
    ctx.fillText(data.trx, colRight, y)
    y += 36

    ctx.textAlign = "left"
    ctx.fillText("Status", colLabel, y)
    ctx.textAlign = "left"
    ctx.fillText(data.status, colMid, y)
    ctx.textAlign = "right"
    ctx.fillText(data.trx, colRight, y)
    y += 36

    y += 14
    dashed(ctx, L, R, y)
    y += 56

    const barX = L + 10
    const barW = (R - L) - 20
    const barH = 120
    drawBarcode(ctx, barX, y, barW, barH)
    y += barH + 60

    ctx.textAlign = "center"
    ctx.fillStyle = "#111"
    ctx.font = "700 22px monospace"
    ctx.fillText("Terima kasih sudah melakukan order - @FyzzModss", cardX + cardW / 2, y)
    y += 36
    ctx.fillStyle = "#555"
    ctx.font = "600 18px monospace"
    ctx.fillText("Simpan struk ini sebagai bukti transaksi.", cardX + cardW / 2, y)

    return canvas.toBuffer("image/png")
}

let handler = async (m, { conn, text, usedPrefix, command, RaplyGwe }) => {
    const parts = text.split(',').map(v => v.trim())
    
    if (!parts[0] || !parts[1] || !parts[2]) {
        return RaplyGwe(`*Format:*\n*${usedPrefix + command}* Fyzz, Jasa Install Panel, 50000`)
    }

    const [username, item, nominalStr] = parts
    const nominal = Number(nominalStr)

    if (isNaN(nominal) || nominal <= 0) {
        return RaplyGwe(`❌ Nominal tidak valid.`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const buffer = createReceipt({
            username: username,
            item: item,
            nominal: nominal,
            status: 'BERHASIL',
            metode: 'QRIS'
        })

        const dateObj = new Date()
        const day = dateObj.getDate()
        const month = dateObj.toLocaleString('id-ID', { month: 'long' })
        const year = dateObj.getFullYear()
        const date = `${day} - ${month} - ${year}`

        const textDone = `*✅ Transaksi Berhasil*
- ${item}
- ${date}

*Ready Jasa & Produk :*
- Panel Pterodactyl Private
- Script Bot WhatsApp
- Costum Script Bot Whatsapp
- Jasa Install panel Pterodactly
- Jasa Fix Error/Edit/Tambah Fitur Script Bot WhatsApp
- Dan lain lain.

*Grup Free Script New*
${config.groupUrl}

*📩 Contact Admin/Owner*
╴ *Telegram:* ${config.telegramUrl}
╴ *WhatsApp:* ${config.whatsappUrl}

*Channel Information 🔖:* 
${config.saluranUrl}`

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: textDone,
            contextInfo: {
                forwardingScore: 9,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluranId,
                    newsletterName: config.saluranName,
                    serverMessageId: 127
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await RaplyGwe(`❌ *Gagal membuat struk:* ${e.message}`)
    }
}

handler.command = /^(struk)$/i
handler.tags = ['store']
handler.help = ['done <username>, <item>, <nominal>']

export default handler