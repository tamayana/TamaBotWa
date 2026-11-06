import os from 'os'
import config from '../../config.js'

let handler = async (m, { conn }) => {
    const start = Date.now()
    await m.react('⏱️')
    const latency = Date.now() - start

    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    
    const formatBytes = (bytes) => {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 B'
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
    }
    
    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / 86400)
        const h = Math.floor((seconds % 86400) / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        return [d && `${d}D`, h && `${h}H`, m && `${m}M`, `${s}S`].filter(Boolean).join(' ')
    }

    const ramStr = `${formatBytes(usedMem)} / ${formatBytes(totalMem)}`
    const uptimeStr = formatUptime(process.uptime())
    const platform = `${os.platform()} ${os.arch()}`
    const hostname = os.hostname()

    const html = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Share+Tech+Mono&display=swap');
            
            .dashboard {
                font-family: 'Segoe UI', Tahoma, sans-serif;
                background: linear-gradient(145deg, #09090b, #18181b);
                padding: 24px;
                border-radius: 20px;
                border: 1px solid #27272a;
                color: #f4f4f5;
                box-shadow: 0 10px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);
                max-width: 400px;
                margin: 0 auto;
                overflow: hidden;
                position: relative;
            }
            .dashboard::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; height: 2px;
                background: linear-gradient(90deg, transparent, #38bdf8, #a855f7, transparent);
                animation: scan 3s linear infinite;
            }
            @keyframes scan {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .title {
                text-align: center;
                font-family: 'Orbitron', sans-serif;
                font-size: 20px;
                font-weight: 700;
                letter-spacing: 2px;
                color: #e4e4e7;
                margin-bottom: 20px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .row {
                display: flex;
                align-items: center;
                background: rgba(39, 39, 42, 0.5);
                padding: 12px 16px;
                border-radius: 12px;
                margin-bottom: 10px;
                border: 1px solid #3f3f46;
                transition: all 0.3s ease;
            }
            .row:hover {
                background: rgba(63, 63, 70, 0.8);
                border-color: #52525b;
            }
            .icon-box {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                padding: 4px;
            }
            .label {
                flex-grow: 1;
                font-size: 14px;
                color: #a1a1aa;
                font-weight: 600;
            }
            .value {
                font-family: 'Share Tech Mono', monospace;
                font-size: 14px;
                font-weight: 700;
                text-align: right;
            }
            .color-green { color: #4ade80; text-shadow: 0 0 10px rgba(74, 222, 128, 0.4); }
            .color-blue { color: #38bdf8; text-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }
            .color-orange { color: #f59e0b; text-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
            .color-purple { color: #c084fc; text-shadow: 0 0 10px rgba(192, 132, 252, 0.4); }
            
            /* SVG Animations */
            .spin { animation: spin 2s linear infinite; transform-origin: center; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
            
            .pulse { animation: pulse 1.5s ease-in-out infinite; transform-origin: center; }
            @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
            
            .blink { animation: blink 1s step-end infinite; }
            @keyframes blink { 50% { opacity: 0; } }
            
            .float { animation: float 2s ease-in-out infinite; }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        </style>

        <div class="dashboard">
            <div class="title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="float">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                System Status
            </div>

            <div class="row">
                <div class="icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pulse">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                </div>
                <div class="label">Ping / Latency</div>
                <div class="value color-green">${latency} ms</div>
            </div>

            <div class="row">
                <div class="icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6.01" y2="6" class="blink"></line>
                        <line x1="6" y1="18" x2="6.01" y2="18" class="blink"></line>
                    </svg>
                </div>
                <div class="label">Platform</div>
                <div class="value color-blue">${platform}</div>
            </div>

            <div class="row">
                <div class="icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                        <rect x="9" y="9" width="6" height="6"></rect>
                        <line x1="9" y1="1" x2="9" y2="4"></line>
                        <line x1="15" y1="1" x2="15" y2="4"></line>
                        <line x1="9" y1="20" x2="9" y2="23"></line>
                        <line x1="15" y1="20" x2="15" y2="23"></line>
                        <line x1="20" y1="9" x2="23" y2="9"></line>
                        <line x1="20" y1="14" x2="23" y2="14"></line>
                        <line x1="1" y1="9" x2="4" y2="9"></line>
                        <line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                </div>
                <div class="label">Memory (RAM)</div>
                <div class="value color-orange">${ramStr}</div>
            </div>

            <div class="row">
                <div class="icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14" class="spin"></polyline>
                    </svg>
                </div>
                <div class="label">Uptime Server</div>
                <div class="value color-purple">${uptimeStr}</div>
            </div>

            <div style="text-align: center; font-size: 11px; color: #52525b; margin-top: 15px; font-family: 'Share Tech Mono', monospace;">
                HOST: ${hostname.toUpperCase()} <br> ${config.botName || 'TamaBotWa'} © 2026
            </div>
        </div>
    `

    const data = {
        response_id: 'PopiooNixelPopiooNixelPopiooNixel',
        sections: [{
            __typename: 'GenAIUnifiedResponseSection',
            view_model: {
                __typename: 'GenAISingleLayoutViewModel',
                primitive: {
                    __typename: 'GenAIBotProgressStatusPrimitive',
                    title: 'KLIK TEKS INI',
                    is_in_progress: true
                }
            }
        }],
        embedded_screens: [{
            title: 'Preview',
            content: [{
                __typename: 'FOAIDNixelButtonSheets',
                tabs: [{
                    id: 'tab_0',
                    tab_header: 'TamaBotWa',
                    sections: [{
                        __typename: 'GenAIUnifiedResponseSection',
                        view_model: {
                            __typename: 'GenAISingleLayoutViewModel',
                            primitive: {
                                __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                payload: html,
                                url: 'https://example.com',
                                trusted_sources: ['example.com']
                            }
                        }
                    }],
                    step_entries: []
                }]
            }]
        }]
    }

    await conn.relayMessage(m.chat, {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            botMetadata: {
                messageDisclaimerText: '',
                richResponseSourcesMetadata: {}
            }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify(data)).toString('base64')
                    },
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedAiBotMessageInfo: { botJid: '0@bot' },
                        forwardOrigin: 4
                    }
                }
            }
        }
    }, {
        messageId: await conn.generateMessageTag()
    })
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = /^(ping)$/i

export default handler
