import { contactSchema } from '@/lib/schema'
import { sendContactEmail } from '@/lib/send-email'
import { prisma } from '@/lib/prisma'
import { trackLeadCreated } from '@/lib/event-service'
import { generateAndStoreLeadResponse } from '@/lib/ai-response'
import { scoreLead, getTemperature } from '@/lib/lead-scoring'
import { buildLeadAlert, sendTelegramMessage } from '@/lib/telegram'

const rateLimitMap = new Map<string, { count: number; reset: number }>()

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
    const key = `rl:${ip}`
    const now = Date.now()
    const entry = rateLimitMap.get(key)
    if (entry && now < entry.reset && entry.count >= 3) {
      return Response.json({ error: 'Demasiadas solicitudes. Inténtalo más tarde.' }, { status: 429 })
    }
    rateLimitMap.set(key, entry && now < entry.reset
      ? { count: entry.count + 1, reset: entry.reset }
      : { count: 1, reset: now + 3_600_000 })

    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { email, mensaje, tipo } = parsed.data

    const score = scoreLead({ email, mensaje, tipo: tipo ?? null })
    const temperature = getTemperature(score)

    const lead = await prisma.lead.create({
      data: { email, mensaje, tipo, score, temperature },
    })

    const tasks: Promise<unknown>[] = [
      sendContactEmail(email, mensaje, tipo),
      trackLeadCreated(lead),
    ]

    if (temperature === 'hot') {
      tasks.push(
        generateAndStoreLeadResponse({ id: lead.id, email, mensaje, tipo: tipo ?? null }),
        sendTelegramMessage(buildLeadAlert({ email, mensaje, tipo: tipo ?? null, score, temperature })),
      )
    } else if (temperature === 'warm') {
      tasks.push(
        generateAndStoreLeadResponse({ id: lead.id, email, mensaje, tipo: tipo ?? null }),
      )
    }

    await Promise.all(tasks)

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
