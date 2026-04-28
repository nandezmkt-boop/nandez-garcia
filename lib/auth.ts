import { timingSafeEqual, createHash } from 'crypto'

export function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD
  if (!stored) return false
  const a = createHash('sha256').update(password).digest()
  const b = createHash('sha256').update(stored).digest()
  return timingSafeEqual(a, b)
}
