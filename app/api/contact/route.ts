import { contactSchema } from '@/lib/schema'
import { sendContactEmail } from '@/lib/send-email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { email, mensaje } = parsed.data
    await sendContactEmail(email, mensaje)

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
