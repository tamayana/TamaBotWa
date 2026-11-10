import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_FILE = path.join(__dirname, '../../database/tempmail.json')

/// ─────────── [ Penyimpanan ] ────────── ///
const activeMails = new Map()
try {
  const saved = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  for (const [email, data] of Object.entries(saved)) {
    if (data?.provider === '1secmail') activeMails.set(email, data)
    else if (data?.token && (!data.expiresAt || data.expiresAt > Date.now())) activeMails.set(email, data)
  }
} catch { /* belum ada file, mulai kosong */ }

const lastMailByUser = new Map()

const saveMails = () => {
  try {
    for (const [email, data] of activeMails) if (data.expiresAt && data.expiresAt <= Date.now()) activeMails.delete(email)
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
    fs.writeFileSync(DB_FILE, JSON.stringify(Object.fromEntries(activeMails), null, 2))
  } catch {}
}

/// ─────────── [ API 1: Tempail - Utama ] ────────── ///
const tempail = {
  base: 'https://tempail.top/api',
  headers: { 'user-agent': 'Postify/1.0.0' },
  timeout: 15000,
  createEmail: async () => {
    const res = await axios.post(`${tempail.base}/email/create/ApiTempail`, null, { headers: tempail.headers, timeout: tempail.timeout })
    if (res.data?.status !== 'success' || !res.data.data) throw new Error('Tempail gagal')
    const { email, email_token, deleted_in } = res.data.data
    if (!email || !email_token) throw new Error('Tempail respons tidak lengkap')
    const time = new Date(deleted_in).getTime()
    return { email, token: email_token, deletedIn: deleted_in, expiresAt: Number.isFinite(time) ? time : null, provider: 'tempail' }
  },
  getMessages: async (entry) => {
    if (entry.expiresAt && Date.now() > entry.expiresAt) return { expired: true, messages: [] }
    const res = await axios.get(`${tempail.base}/messages/${encodeURIComponent(entry.token)}/ApiTempail`, { headers: tempail.headers, timeout: tempail.timeout })
    if (res.data?.status !== 'success') throw new Error('Gagal ambil list pesan')
    const { mailbox, messages } = res.data.data || {}
    return { mailbox, messages: Array.isArray(messages) ? messages : [] }
  },
  getMessage: async (messageId) => {
    const res = await axios.get(`${tempail.base}/message/${encodeURIComponent(messageId)}/ApiTempail`, { headers: tempail.headers, timeout: tempail.timeout })
    if (res.data?.status !== 'success') throw new Error('Gagal ambil isi pesan')
    const msg = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
    if (!msg) throw new Error('Pesan tidak ditemukan')
    return { subject: msg.subject, isSeen: msg.is_seen, from: msg.from, fromEmail: msg.from_email, receivedAt: msg.receivedAt, id: msg.id, content: msg.content }
  }
}

/// ─────────── [ API 2: 1SecMail - Cadangan Gratis, Tanpa Key ] ────────── ///
const secmail = {
  base: 'https://www.1secmail.com/api/v1/',
  timeout: 15000,
  parse: (email) => {
    const [login, domain] = email.split('@')
    return { login, domain }
  },
  createEmail: async () => {
    const res = await axios.get(`${secmail.base}?action=genRandomMailbox&count=1`, { timeout: secmail.timeout })
    const email = Array.isArray(res.data) ? res.data[0] : null
    if (!email) throw new Error('1SecMail gagal')
    return { email, token: email, deletedIn: '10 menit (estimasi)', expiresAt: Date.now() + 10 * 60 * 1000, provider: '1secmail' }
  },
  getMessages: async (entry) => {
    const { login, domain } = secmail.parse(entry.token)
    const res = await axios.get(`${secmail.base}?action=getMessages&login=${login}&domain=${domain}`, { timeout: secmail.timeout })
    const list = Array.isArray(res.data) ? res.data : []
    // Format samain ke tempail biar handler gak pusing
    return { mailbox: entry.token, messages: list.map(v => ({ id: String(v.id), subject: v.subject, from: v.from })) }
  },
  getMessage: async (messageId, entryEmail) => {
    // Untuk 1secmail butuh login+domain, jadi kita cari dari activeMails via id tidak bisa.
    // Solusi: pesanmail untuk 1secmail butuh format "email|id"
    // Tapi biar gampang, kita coba cari email yang punya pesan ini di cache terakhir tidak ada, jadi kita minta format baru.
    throw new Error('FORMAT_1SECMAIL')
  },
  getMessageByEmail: async (email, messageId) => {
    const { login, domain } = secmail.parse(email)
    const res = await axios.get(`${secmail.base}?action=readMessage&login=${login}&domain=${domain}&id=${messageId}`, { timeout: secmail.timeout })
    if (!res.data?.id) throw new Error('Pesan tidak ditemukan')
    const msg = res.data
    // content bisa htmlBody / textBody / body
    return { subject: msg.subject, isSeen: true, from: msg.from, fromEmail: msg.from, receivedAt: msg.date, id: String(msg.id), content: msg.htmlBody || msg.textBody || msg.body || '' }
  }
}

let handler = async (m, { command, args, text, usedPrefix }) => {
  const input = (text || (args || []).join(' ') || '').trim()

  switch ((command || '').toLowerCase()) {
    case 'tempmail': {
      let res = null, lastErr = null
      try { res = await tempail.createEmail() } catch (e) { lastErr = e; try { res = await secmail.createEmail() } catch (e2) { lastErr = e2 } }
      if (!res) return m.reply(`Gagal bikin email temp nya bree.. (${lastErr?.message || 'API down'}) Coba lagi nanti.`)

      activeMails.set(res.email.toLowerCase(), { token: res.token, expiresAt: res.expiresAt, provider: res.provider })
      lastMailByUser.set(m.sender, res.email.toLowerCase())
      saveMails()

      return m.reply(`📫 *Email Sementara berhasil dibuat!*\n📧 Email: ${res.email}\n🕐 Expired: ${res.deletedIn}\n⚡ Provider: ${res.provider === '1secmail' ? 'Cadangan (1SecMail)' : 'Utama (Tempail)'}\n\nGunakan email ini untuk cek inbox:\n*${usedPrefix}cekmail ${res.email}*`)
    }

    case 'cekmail': {
      const email = (input || lastMailByUser.get(m.sender) || '').toLowerCase()
      if (!email) return m.reply(`Contoh penggunaan: ${usedPrefix}cekmail <alamat_email>\n\nBelum punya email? Buat dulu dengan *${usedPrefix}tempmail*`)
      const entry = activeMails.get(email)
      if (!entry) return m.reply(`❌ Email tidak ditemukan di database bot (mungkin sudah kadaluarsa). Silakan buat baru dengan *${usedPrefix}tempmail*`)
      if (entry.expiresAt && Date.now() > entry.expiresAt && entry.provider === 'tempail') { activeMails.delete(email); saveMails(); return m.reply('Email Tempnya udah expired bree..') }

      try {
        const res = entry.provider === '1secmail' ? await secmail.getMessages(entry) : await tempail.getMessages(entry)
        if (res.expired) { activeMails.delete(email); saveMails(); return m.reply('Email Tempnya udah expired bree..') }
        if (res.messages.length === 0) return m.reply('📭 Belum ada pesan yang masuk.')
        const out = `📥 *Daftar Pesan Masuk*\n📫 Email: ${res.mailbox || email}\n\n` +
          res.messages.map((v, i) => `🔹 *${i + 1}*. ${v.subject || '(Tanpa Subjek)'}\n📩 ID: ${v.id}`).join('\n\n')
        // Kalo 1secmail, kasih tau format pesanmail nya beda
        const hint = entry.provider === '1secmail' ? `\n\nGunakan *${usedPrefix}pesanmail ${email}|${res.messages[0].id}* untuk baca isi pesannya.\nFormat: pesanmail <email>|<id>` : `\n\nGunakan *${usedPrefix}pesanmail <id>* untuk baca isi pesannya.`
        return m.reply(out + hint)
      } catch (e) { return m.reply(`Gagal ambil list pesan bree.. (${e.message})`) }
    }

    case 'pesanmail': {
      if (!input) return m.reply(`Contoh: ${usedPrefix}pesanmail <message_id>\nKalo provider cadangan: ${usedPrefix}pesanmail email@1secmail.com|12345`)

      // Format baru untuk 1secmail: email|id
      if (input.includes('|')) {
        const [email, messageId] = input.split('|').map(s => s.trim())
        try {
          const msg = await secmail.getMessageByEmail(email.toLowerCase(), messageId)
          return m.reply(formatPesan(msg))
        } catch (e) { return m.reply(`Gagal ambil isi pesan bree.. (${e.message})`) }
      }

      // Default: tempail (cara lama)
      try {
        const msg = await tempail.getMessage(input)
        return m.reply(formatPesan(msg))
      } catch (e) { return m.reply(`Gagal ambil isi pesan bree.. (${e.message})`) }
    }
  }
}

function formatPesan(msg) {
  const rawContent = String(msg.content || '')
  const decode = (s) => s.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&nbsp;/gi, ' ')
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/g
  const extractedLinks = (decode(rawContent).match(urlRegex) || []).map(l => l.replace(/[).,;]+$/, ''))
  const uniqueLinks = [...new Set(extractedLinks)].slice(0, 10)
  let linkSection = ''
  if (uniqueLinks.length > 0) linkSection = '\n\n🔗 *Link yang Ditemukan:*\n' + uniqueLinks.map((link, idx) => `${idx + 1}. ${link}`).join('\n')
  let cleanContent = decode(rawContent.replace(/<(style|script)[\s\S]*?<\/\1>/gi, '').replace(/<br\s*\/?>|<\/(p|div|tr|h[1-6]|li)>/gi, '\n').replace(/<[^>]*>/g, '')).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  if (cleanContent.length > 3000) cleanContent = cleanContent.slice(0, 3000) + '\n...(dipotong)'
  return `📨 *Isi Pesan*\n📌 Subjek: ${msg.subject || '(Tanpa Subjek)'}\n👤 Dari: ${msg.from || '-'} <${msg.fromEmail || '-'}>\n🕐 Diterima: ${msg.receivedAt || '-'}\n🆔 ID: ${msg.id}\n\n📬 Pesan:\n${cleanContent || '(Tidak ada isi)'}${linkSection}`
}

handler.help = ['tempmail', 'cekmail <email>', 'pesanmail <id>']
handler.tags = ['tools']
handler.command = /^(tempmail|cekmail|pesanmail)$/i

export default handler
