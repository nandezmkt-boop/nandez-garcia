import type { Temperature } from './lead-scoring'

const TELEGRAM_API = 'https://api.telegram.org'

const TEMP_EMOJI: Record<Temperature, string> = {
  hot:  '🔥',
  warm: '🌡',
  cold: '❄️',
}

// Must be applied to any user-supplied string inserted into an HTML-formatted
// Telegram message. The Telegram HTML parser rejects messages containing
// unescaped &, < or > and returns 400 silently from our catch block.
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

type LeadAlertInput = {
  email: string
  mensaje: string
  tipo: string | null
  score: number
  temperature: Temperature
}

export function buildLeadAlert({ email, mensaje, tipo, score, temperature }: LeadAlertInput): string {
  const emoji = TEMP_EMOJI[temperature]
  const prefix = temperature === 'hot' ? '⚡ LEAD CALIENTE — RESPONDER PRONTO' : `${emoji} Nuevo lead`
  const tipoLine = tipo ? `\n<b>Tipo:</b> ${escapeHtml(tipo)}` : ''
  const preview = mensaje.length > 120 ? mensaje.slice(0, 120) + '…' : mensaje
  return [
    `${emoji} <b>${prefix}</b>`,
    `<b>Score:</b> ${score}/100`,
    `<b>Email:</b> ${escapeHtml(email)}${tipoLine}`,
    '',
    `<i>${escapeHtml(preview)}</i>`,
  ].join('\n')
}

export async function sendTelegramMessage(text: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping')
    return
  }

  try {
    console.log('[telegram] Sending message...')

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
