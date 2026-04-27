import { createEvent, EventType } from './events'

type LeadSnapshot = {
  id: string
  email: string
  tipo?: string | null
  status: string
  source?: string
}

export async function trackLeadCreated(lead: LeadSnapshot): Promise<void> {
  await createEvent({
    type: EventType.LEAD_CREATED,
    entity: 'Lead',
    entityId: lead.id,
    payload: {
      email: lead.email,
      tipo: lead.tipo ?? null,
      status: lead.status,
      source: lead.source ?? 'landing',
    },
  })
}

export async function trackLeadStatusChanged(
  lead: LeadSnapshot,
  previousStatus: string
): Promise<void> {
  if (previousStatus === lead.status) return
  await createEvent({
    type: EventType.LEAD_STATUS_CHANGED,
    entity: 'Lead',
    entityId: lead.id,
    payload: {
      email: lead.email,
      previousStatus,
      newStatus: lead.status,
    },
  })
}
