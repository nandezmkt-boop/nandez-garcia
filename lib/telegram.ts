const TELEGRAM_API = 'https://api.telegram.org'

export async function sendTelegramMessage(text: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping')
    return
  }

  try {
    console.log(`[telegram] Sending message to chat ${chatId}...`)

    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    chatId,
        text,
        parse_mode: 'HTML',
      }),
    })

    if (res.ok) {
      console.log('[telegram] Message sent OK')
    } else {
      const body = await res.text()
      console.error('[telegram] API error:', res.status, body)
    }
  } catch (err) {
    console.error('[telegram] Network error:', err)
  }
}
