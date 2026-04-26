import { contactSchema } from '@/lib/schema'
import { sendContactEmail } from '@/lib/send-email'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { email, mensaje, tipo } = parsed.data

    await prisma.lead.create({
      data: { email, mensaje, tipo },
    })

    await sendContactEmail(email, mensaje, tipo)

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
