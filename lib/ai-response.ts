import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const MODEL = 'claude-haiku-4-5'
const MAX_TOKENS = 600

const TIPO_BRIEF: Record<string, string> = {
  negocio:
    'Quiere una página/web que capte clientes — perfil con negocio en marcha, busca conversión.',
  idea:
    'Tiene una idea por lanzar — perfil emprendedor en fase temprana, necesita validación y MVP.',
  'no-claro':
    'No lo tiene claro — necesita orientación previa antes de hablar de proyecto concreto.',
}

const SYSTEM_PROMPT = `Eres José Ignacio Nández García, experto en marketing digital y desarrollo web. Respondes personalmente a cada lead que llega desde tu web nandezgarcia.com.

Tu estilo:
- Cercano y humano, NO corporativo. Tutea siempre.
- Persuasivo sin ser agresivo. No vendes humo, das valor primero.
- Conciso: 4-7 frases, máximo 120 palabras. Nadie lee emails largos.
- Adaptas el tono al perfil del lead (negocio establecido vs idea por lanzar vs persona indecisa).
- Demuestras que has leído su mensaje (referencia algo concreto de lo que escribió).
- Cierras SIEMPRE con una pregunta abierta que invite a seguir la conversación.

Reglas estrictas:
- NO uses emojis.
- NO uses fórmulas vacías ("¡Qué interesante tu propuesta!", "Gracias por contactar").
- NO prometas plazos, precios, ni entregables concretos.
- NO inventes información sobre el lead que no esté en su mensaje.
- Devuelves SOLO el cuerpo del email en texto plano (sin asunto, sin saludo formal tipo "Estimado", sin firma).
- Empieza directamente con un saludo corto ("Hola [nombre o vacío],") y entra al grano.
- Si el mensaje es muy vago, pide UNA cosa concreta para avanzar (ej: "¿qué tipo de cliente quieres atraer?").`

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

type LeadInput = {
  id: string
  email: string
  mensaje: string
  tipo: string | null
}

function buildUserPrompt(lead: LeadInput): string {
  const perfil = lead.tipo ? TIPO_BRIEF[lead.tipo] ?? `Tipo declarado: ${lead.tipo}` : 'Sin tipo declarado.'
  return [
    `Perfil del lead: ${perfil}`,
    `Email: ${lead.email}`,
    '',
    'Mensaje recibido:',
    '"""',
    lead.mensaje,
    '"""',
    '',
    'Redacta tu respuesta personal siguiendo las reglas del system prompt.',
  ].join('\n')
}

export async function generateLeadResponse(lead: LeadInput): Promise<string> {
  if (!anthropic) {
    throw new Error('ANTHROPIC_API_KEY no está configurada')
  }

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(lead) }],
  })

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim()

  if (!text) throw new Error('LLM devolvió respuesta vacía')
  return text
}

/**
 * Idempotent: si el lead ya tiene aiResponse, no regenera.
 * Captura todos los errores y los persiste en aiError — nunca lanza.
 */
export async function generateAndStoreLeadResponse(
  lead: LeadInput,
  options: { force?: boolean } = {},
): Promise<{ ok: true; response: string } | { ok: false; error: string }> {
  if (!options.force) {
    const existing = await prisma.lead.findUnique({
      where: { id: lead.id },
      select: { aiResponse: true },
    })
    if (existing?.aiResponse) {
      return { ok: true, response: existing.aiResponse }
    }
  }

  try {
    const response = await generateLeadResponse(lead)
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        aiResponse: response,
        aiResponseAt: new Date(),
        aiError: null,
      },
    })
    console.log(`[ai-response] Generated for ${lead.email} (${response.length} chars)`)
    return { ok: true, response }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[ai-response] Failed for ${lead.email}:`, message)
    await prisma.lead.update({
      where: { id: lead.id },
      data: { aiError: message.slice(0, 500) },
    }).catch(e => console.error('[ai-response] Could not persist aiError:', e))
    return { ok: false, error: message }
  }
}
