const KEYWORDS = ['precio', 'presupuesto', 'trabajar', 'servicio', 'web', 'proyecto', 'contratar', 'cuánto', 'cuanto', 'coste', 'costo']
const SUSPICIOUS_PREFIXES = ['test', 'hola', 'prueba', 'demo', 'fake', 'noreply', 'no-reply', 'asdf', 'qwerty', 'aaa', 'example']

export type Temperature = 'cold' | 'warm' | 'hot'

type ScoreInput = {
  email: string
  mensaje: string
  tipo: string | null
}

export function scoreLead({ email, mensaje, tipo }: ScoreInput): number {
  let score = 0

  if (mensaje.length > 50) score += 30

  const lower = mensaje.toLowerCase()
  if (KEYWORDS.some(kw => lower.includes(kw))) score += 30

  if (tipo === 'negocio') score += 20

  const localPart = email.split('@')[0].toLowerCase()
  if (!SUSPICIOUS_PREFIXES.some(p => localPart.startsWith(p))) score += 10

  return Math.min(100, score)
}

export function getTemperature(score: number): Temperature {
  if (score >= 71) return 'hot'
  if (score >= 31) return 'warm'
  return 'cold'
}
