export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Metode tidak diizinkan.' })
  }

  try {
    const { firstName, lastName } = request.body || {}
    const cleanFirstName = typeof firstName === 'string' ? firstName.trim() : ''
    const cleanLastName = typeof lastName === 'string' ? lastName.trim() : ''

    if (!cleanFirstName || !cleanLastName || cleanFirstName.length > 100 || cleanLastName.length > 100) {
      return response.status(400).json({ error: 'Data form tidak valid.' })
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) {
      return response.status(500).json({ error: 'Konfigurasi Telegram belum tersedia.' })
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Pengisian form baru\nNama Depan: ${cleanFirstName}\nNama Belakang: ${cleanLastName}`,
      }),
    })

    if (!telegramResponse.ok) {
      return response.status(502).json({ error: 'Pesan Telegram gagal dikirim.' })
    }

    return response.status(200).json({ ok: true })
  } catch {
    return response.status(500).json({ error: 'Terjadi kesalahan saat mengirim form.' })
  }
}
