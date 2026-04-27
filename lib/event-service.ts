import { createEvent, EventType } from './events'
import { sendTelegramMessage, escapeHtml } from './telegram'

type LeadSnapshot = {
  id: string
  email: string
  mensaje?: string | null
  tipo?: string | null
  status: string
  source?: string
}

const STATUS_LABELS: Record<string, string> = {
  new:       'Nuevo',
  contacted: 'Contactado',
  closed:    'Cerrado',
}

const TIPO_LABELS: Record<string, string> = {
  negocio:    'Negocio',
  idea:       'Idea',
  'no-claro': 'Sin definir',
}

function statusLabel(s: string) { return STATUS_LABELS[s] ?? s }
// tipoLabel result may fall back to raw user input → must be escaped at call site
function tipoLabel(t: string | null | undefined) { return t ? (TIPO_LABELS[t] ?? t) : 'Sin definir' }
function truncate(s: string, n = 200) { return s.length > n ? s.slice(0, n) + '…' : s }

export async function trackLeadCreated(lead: LeadSnapshot): Promise<void> {
  console.log(`[event-service] LEAD_CREATED ${lead.email}`)

  await createEvent({
    type: EventType.LEAD_CREATED,
    entity: 'Lead',
    entityId: lead.id,
    payload: {
      email:  lead.email,
      tipo:   lead.tipo ?? null,
      status: lead.status,
      source: lead.source ?? 'landing',
    },
  })

  const lines = [
    '🆕 <b>Nuevo lead</b>',
    '',
    `📧 <b>Email:</b> ${escapeHtml(lead.email)}`,
    `📌 <b>Tipo:</b> ${escapeHtml(tipoLabel(lead.tipo))}`,
  ]
  if (lead.mensaje) {
    lines.push(`💬 <b>Mensaje:</b> ${escapeHtml(truncate(lead.mensaje))}`)
  }

  await sendTelegramMessage(lines.join('\n'))
}

export async function trackLeadStatusChanged(
  lead: LeadSnapshot,
  previousStatus: string
): Promise<void> {
  if (previousStatus === lead.status) return

  console.log(`[event-service] LEAD_STATUS_CHANGED ${lead.email}: ${previousStatus} → ${lead.status}`)

  await createEvent({
    type: EventType.LEAD_STATUS_CHANGED,
    entity: 'Lead',
    entityId: lead.id,
    payload: {
      email:          lead.email,
      previousStatus,
      newStatus:      lead.status,
    },
  })

  const text = [
    '<b>Lead actualizado</b>',
    '',
    `📧 <b>Email:</b> ${escapeHtml(lead.email)}`,
    `📊 <b>Estado anterior:</b> ${statusLabel(previousStatus)}`,
    `✅ <b>Nuevo estado:</b> ${statusLabel(lead.status)}`,
  ].join('\n')

  await sendTelegramMessage(text)
}
