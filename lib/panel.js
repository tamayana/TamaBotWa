import fetch from 'node-fetch'
import config from '../config.js'
import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

/// ─────────── [ 𝖫𝗂𝗌𝗍 𝖣𝖺𝖿𝗍𝖺𝗋 𝖱𝖺𝗆 ] ────────── ///
export const Listpanel = {
    '1gb': { ram: 1000, disk: 1000, cpu: 40 },
    '2gb': { ram: 2000, disk: 1000, cpu: 60 },
    '3gb': { ram: 3000, disk: 2000, cpu: 80 },
    '4gb': { ram: 4000, disk: 2000, cpu: 100 },
    '5gb': { ram: 5000, disk: 3000, cpu: 120 },
    '6gb': { ram: 6000, disk: 3000, cpu: 140 },
    '7gb': { ram: 7000, disk: 4000, cpu: 160 },
    '8gb': { ram: 8000, disk: 4000, cpu: 180 },
    '9gb': { ram: 9000, disk: 5000, cpu: 200 },
    '10gb': { ram: 10000, disk: 5000, cpu: 220 },
    'unli': { ram: 0, disk: 0, cpu: 0 },
    'unlimited': { ram: 0, disk: 0, cpu: 0 }
}

/// ─────────── [ 𝖥𝗈𝗋𝗆𝖺𝗍 𝖳𝖾𝗄𝗌 ] ────────── ///
export const capital = (text = '') => String(text).replace(/\b\w/g, c => c.toUpperCase())
export const fmtRam = (mb) => (Number(mb) === 0 ? 'Unlimited' : `${Number(mb) / 1000}GB`)
export const fmtCpu = (cpu) => (Number(cpu) === 0 ? 'Unlimited' : `${cpu}%`)

/// ─────────── [ 𝖪𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗌𝗂 𝖯𝖺𝗇𝖾𝗅 ] ────────── ///
export const isPterodactyl = () => !!(config.panel?.domain && config.panel?.apikey)

export const panelUrl = () => {
    const domain = String(config.panel?.domain || '').trim().replace(/\/+$/, '')
    return domain.startsWith('http') ? domain : `https://${domain}`
}

/// ─────────── [ 𝖠𝗉𝗉𝗅𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖯𝗍𝖾𝗋𝗈𝖽𝖺𝖼𝗍𝗒𝗅 ] ────────── ///
export async function pteroRequest(endpoint, method = 'GET', body) {
    const res = await fetch(panelUrl() + endpoint, {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.panel.apikey
        },
        body: body ? JSON.stringify(body) : undefined
    })

    const raw = await res.text()
    let data = null
    try { data = raw ? JSON.parse(raw) : null } catch { data = null }

    return { ok: res.ok, status: res.status, data }
}

export const pteroError = (res) => res.data?.errors?.[0]?.detail || `HTTP ${res.status}`

/// ─────────── [ 𝖲𝖾𝗇𝖽 𝖠𝗄𝗎𝗇 𝖯𝖺𝗇𝖾𝗅 ] ────────── ///
export async function sendAccount(conn, { chat, fallback, user, password, serverId, spec }) {
    const teks = `‼️ *𝖲𝖴𝖢𝖢𝖤𝖤𝖣 𝖢𝖱𝖤𝖠𝖳𝖤 𝖠𝖣𝖬𝖨𝖭*`

    const sertifikat = spec
        ? `\n*📡 𝖲𝖤𝖱𝖳𝖨𝖥𝖨𝖪𝖠𝖳*
- 𝖱𝖺𝗆: ${fmtRam(spec.ram)}
- 𝖣𝗂𝗌𝗄: ${fmtRam(spec.disk)}
- 𝖢𝗉𝗎: ${fmtCpu(spec.cpu)}\n`
        : ''

    const xdata = `𓈃 *𝖣𝖠𝖳𝖠 𝖯𝖠𝖭𝖤𝖫 𝖠𝖭𝖣𝖠*
└╼ *Username:* ${user.username}
└╼ *Password:* ${password}
└╼ *𝖨𝖣:* ${serverId ?? user.id}

─▢ *Login:* \`${panelUrl()}\`
${sertifikat}
*‼️ 𝖭𝖮𝖳𝖤:*
Masa aktif 30 hari
Data bersifat pribadi
Garansi 15 hari (1x replace)
Klaim wajib menyertakan bukti chat pembelian

📮 *𝖢𝗌 𝖯𝖺𝗇𝖾𝗅:* wa.me/6281313532320`

    const interactive = {
        body: { text: teks },
        footer: { text: xdata },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Copy Username',
                        copy_code: String(user.username)
                    })
                },
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Copy Password',
                        copy_code: String(password)
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Buka Panel',
                        url: panelUrl(),
                        merchant_url: panelUrl()
                    })
                }
            ],
            messageParamsJson: '{}'
        }
    }

    try {
        const msg = generateWAMessageFromContent(chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactive)
                }
            }
        }, {
            userJid: conn.user.id,
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
        })

        await conn.relayMessage(chat, msg.message, {
            messageId: msg.key.id,
            additionalNodes: [
                {
                    tag: 'biz',
                    attrs: {},
                    content: [
                        {
                            tag: 'interactive',
                            attrs: { type: 'native_flow', v: '1' },
                            content: [
                                { tag: 'native_flow', attrs: { v: '9', name: 'mixed' }, content: [] }
                            ]
                        }
                    ]
                }
            ]
        })
    } catch {
        await conn.sendMessage(fallback, { text: `${teks}\n\n${xdata}` })
    }
}
