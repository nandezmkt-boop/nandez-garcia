import { contactSchema } from '@/lib/schema'
import { sendContactEmail } from '@/lib/send-email'
import { prisma } from '@/lib/prisma'
import { trackLeadCreated } from '@/lib/event-service'
import { generateAndStoreLeadResponse } from '@/lib/ai-response'

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

    // Awaited so Vercel doesn't terminate the function before side-effects finish.
    // generateAndStoreLeadResponse swallows its own errors (persists to aiError),
    // so a failing LLM call never breaks lead creation.
    await Promise.all([
      sendContactEmail(email, mensaje, tipo),
      trackLeadCreated(lead),
      generateAndStoreLeadResponse({
        id: lead.id,
        email: lead.email,
        mensaje: lead.mensaje,
        tipo: lead.tipo,
      }),
    ])

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
