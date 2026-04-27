import { contactSchema } from '@/lib/schema'
import { sendContactEmail } from '@/lib/send-email'
import { prisma } from '@/lib/prisma'
import { trackLeadCreated } from '@/lib/event-service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { email, mensaje, tipo } = parsed.data

    const lead = await prisma.lead.create({
      data: { email, mensaje, tipo },
    })

    await Promise.all([
      sendContactEmail(email, mensaje, tipo),
      trackLeadCreated(lead),
    ])

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
