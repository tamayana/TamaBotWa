let khodamList = ['Macan Putih', 'Naga Hitam', 'Kuntilanak', 'Tuyul', 'Pocong Ganteng', 'Jin Tomang', 'Harimau Sumatera', 'Elang Jawa', 'Buaya Darat', 'Bidadari', 'Gajah Mada', 'Kera Sakti', 'Ular Naga', 'Hantu Casper', 'Dewa Mabuk', 'Singa', 'Serigala', 'Kuda Lumping']
let handler = async (m, { conn }) => {
    let target = m.mentionedJid?.[0] || m.sender
    let khodam = khodamList[Math.floor(Math.random() * khodamList.length)]
    await conn.sendMessage(m.chat, { text: `*👻 CEK KHODAM!*\n\n@${target.split('@')[0]} khodam lu adalah:\n\n*${khodam.toUpperCase()}!*\n\n${khodam === 'Tuyul' ? 'Pantes lu suka ngambil duit orang!' : khodam === 'Buaya Darat' ? 'Pantes lu buaya!' : 'Gacor! Jaga baik-baik khodam lu!'}` }, { quoted: m })
}
handler.help = ['khodam']
handler.tags = ['mctama']
handler.command = /^khodam|cekhodam$/i
export default handler
