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
    if (data?.token && (!data.expiresAt || data.expiresAt > Date.now())) activeMails.set(email, data)
  }
} catch { /* belum ada file, mulai kosong */ }

const lastMailByUser = new Map() // pengirim => email terakhir yang dibuat

const saveMails = () => {
  try {
    for (const [email, data] of activeMails) if (data.expiresAt && data.expiresAt <= Date.now()) activeMails.delete(email)
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
    fs.writeFileSync(DB_FILE, JSON.stringify(Object.fromEntries(activeMails), null, 2))
  } catch { /* gagal menyimpan tidak boleh mengganggu fitur */ }
}

const tempail = {
  api: {
    base: 'https://tempail.top/api',
    endpoints: {
      createEmail: '/email/create/ApiTempail',
      getMessages: (emailToken) => `/messages/${encodeURIComponent(emailToken)}/ApiTempail`,
      getMessage: (messageId) => `/message/${encodeURIComponent(messageId)}/ApiTempail`
    }
  },
  headers: { 'user-agent': 'Postify/1.0.0' },
  timeout: 30000,

  createEmail: async () => {
    try {
      const res = await axios.post(
        `${tempail.api.base}${tempail.api.endpoints.createEmail}`,
        null,
        { headers: tempail.headers, timeout: tempail.timeout }
      )
      if (res.data?.status !== 'success' || !res.data.data) return { success: false, code: 500, result: { error: 'Gagal bikin email temp nya bree..' } }

      const { email, email_token: emailToken, deleted_in: deletedIn } = res.data.data
      if (!email || !emailToken) return { success: false, code: 500, result: { error: 'Respons API tidak lengkap, coba lagi nanti.' } }

      const time = new Date(deletedIn).getTime()
      return { success: true, code: 200, email, emailToken, deletedIn, expiresAt: Number.isFinite(time) ? time : null }
    } catch (e) {
      return { success: false, code: e.response?.status || 500, result: { error: e.message } }
    }
  },

  getMessages: async (entry) => {
    if (!entry?.token || typeof entry.token !== 'string' || !entry.token.trim())
      return { success: false, code: 400, result: { error: 'Email token kagak boleh kosong yak bree, harus diisi.. 🗿' } }

    if (entry.expiresAt && Date.now() > entry.expiresAt)
      return { success: false, code: 410, result: { error: 'Email Tempnya udah expired bree..' } }

    try {
      const url = tempail.api.endpoints.getMessages(entry.token)
      const res = await axios.get(`${tempail.api.base}${url}`, { headers: tempail.headers, timeout: tempail.timeout })

      if (res.data?.status !== 'success') return { success: false, code: 500, result: { error: 'Gagal ambil list pesan bree..' } }

      const { mailbox, messages } = res.data.data || {}
      return { success: true, code: 200, mailbox, messages: Array.isArray(messages) ? messages : [] }
    } catch (e) {
      return { success: false, code: e.response?.status || 500, result: { error: e.message } }
    }
  },

  getMessage: async (messageId) => {
    if (!messageId || typeof messageId !== 'string' || !messageId.trim())
      return { success: false, code: 400, result: { error: 'Message ID nya harus diisi bree, kagak kosong yak.. 🗿' } }

    try {
      const url = tempail.api.endpoints.getMessage(messageId)
      const res = await axios.get(`${tempail.api.base}${url}`, { headers: tempail.headers, timeout: tempail.timeout })

      if (res.data?.status !== 'success') return { success: false, code: 500, result: { error: 'Gagal ambil isi pesan bree..' } }

      const msg = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
      if (!msg) return { success: false, code: 404, result: { error: 'Pesan tidak ditemukan bree..' } }

      return {
        success: true,
        code: 200,
        message: {
          subject: msg.subject,
          isSeen: msg.is_seen,
          from: msg.from,
          fromEmail: msg.from_email,
          receivedAt: msg.receivedAt,
          id: msg.id,
          attachments: msg.attachments,
          content: msg.content
        }
      }
    } catch (e) {
      return { success: false, code: e.response?.status || 500, result: { error: e.message } }
    }
  }
}

let handler = async (m, { command, args, text, usedPrefix }) => {
  const input = (text || (args || []).join(' ') || '').trim()

  switch ((command || '').toLowerCase()) {
    case 'tempmail':
      {
        const res = await tempail.createEmail()
        if (!res.success) return m.reply(res.result.error)

         activeMails.set(res.email.toLowerCase(), { token: res.emailToken, expiresAt: res.expiresAt })
        lastMailByUser.set(m.sender, res.email.toLowerCase())
        saveMails()

        return m.reply(`📫 *Email Sementara berhasil dibuat!*
📧 Email: ${res.email}
🕐 Expired: ${res.deletedIn}

Gunakan email ini untuk cek inbox:
*${usedPrefix}cekmail ${res.email}*`)
      }

    case 'cekmail':
      {
        const email = (input || lastMailByUser.get(m.sender) || '').toLowerCase()
        if (!email) return m.reply(`Contoh penggunaan: ${usedPrefix}cekmail <alamat_email>\n\nBelum punya email? Buat dulu dengan *${usedPrefix}tempmail*`)

        const entry = activeMails.get(email)
        if (!entry) return m.reply(`❌ Email tidak ditemukan di database bot (mungkin sudah kadaluarsa). Silakan buat baru dengan *${usedPrefix}tempmail*`)

        const res = await tempail.getMessages(entry)
        if (!res.success) {
          if (res.code === 410) { activeMails.delete(email); saveMails() }
          return m.reply(res.result.error)
        }

        if (res.messages.length === 0) return m.reply('📭 Belum ada pesan yang masuk.')

        const out = `📥 *Daftar Pesan Masuk*\n📫 Email: ${res.mailbox || email}\n\n` +
          res.messages.map((v, i) => `🔹 *${i + 1}*. ${v.subject || '(Tanpa Subjek)'}\n📩 ID: ${v.id}`).join('\n\n')
        return m.reply(out + `\n\nGunakan *${usedPrefix}pesanmail <id>* untuk baca isi pesannya.`)
      }

    case 'pesanmail':
      {
        if (!input) return m.reply(`Contoh: ${usedPrefix}pesanmail <message_id>`)

        const res = await tempail.getMessage(input)
        if (!res.success) return m.reply(res.result.error)

        const msg = res.message
        const rawContent = String(msg.content || '')

        const decode = (s) => s
          .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
          .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&nbsp;/gi, ' ')

        const urlRegex = /(https?:\/\/[^\s"'<>]+)/g
        const extractedLinks = (decode(rawContent).match(urlRegex) || []).map(l => l.replace(/[).,;]+$/, ''))
        const uniqueLinks = [...new Set(extractedLinks)].slice(0, 10)

        let linkSection = ''
        if (uniqueLinks.length > 0) {
          linkSection = '\n\n🔗 *Link yang Ditemukan:*\n' + uniqueLinks.map((link, idx) => `${idx + 1}. ${link}`).join('\n')
        }

        let cleanContent = decode(
          rawContent
            .replace(/<(style|script)[\s\S]*?<\/\1>/gi, '')
            .replace(/<br\s*\/?>|<\/(p|div|tr|h[1-6]|li)>/gi, '\n')
            .replace(/<[^>]*>/g, '')
        ).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()

        if (cleanContent.length > 3000) cleanContent = cleanContent.slice(0, 3000) + '\n...(dipotong)'

        return m.reply(`📨 *Isi Pesan*
📌 Subjek: ${msg.subject || '(Tanpa Subjek)'}
👤 Dari: ${msg.from || '-'} <${msg.fromEmail || '-'}>
🕐 Diterima: ${msg.receivedAt || '-'}
🆔 ID: ${msg.id}

📬 Pesan:
${cleanContent || '(Tidak ada isi)'}${linkSection}`)
      }
  }
}

handler.help = ['tempmail', 'cekmail <email>', 'pesanmail <id>']
handler.tags = ['tools']
handler.command = /^(tempmail|cekmail|pesanmail)$/i

export default handler
