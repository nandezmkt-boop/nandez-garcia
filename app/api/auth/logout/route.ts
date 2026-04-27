import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('admin-auth')
  return Response.json({ ok: true })
}
