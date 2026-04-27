import { prisma } from '@/lib/prisma'
import { trackLeadStatusChanged } from '@/lib/event-service'

const VALID_STATUSES = ['new', 'contacted', 'closed']

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()
    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }

    const existing = await prisma.lead.findUnique({
      where: { id: params.id },
      select: { status: true },
    })
    const previousStatus = existing?.status ?? 'new'

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { status },
    })

    // Awaited explicitly so Vercel doesn't terminate the function before
    // the event is persisted and the Telegram notification is dispatched.
    await trackLeadStatusChanged(lead, previousStatus)

    return Response.json({ ok: true, lead })
  } catch (err) {
    console.error('[leads/patch] Unhandled error:', err)
    return Response.json({ error: 'Error updating lead' }, { status: 500 })
  }
}
