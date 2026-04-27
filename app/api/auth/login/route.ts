import { verifyPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (!verifyPassword(password)) {
    return Response.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  cookies().set('admin-auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  })

  return Response.json({ ok: true })
}
