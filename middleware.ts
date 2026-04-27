import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get('admin-auth')

  // Si ya está autenticado e intenta entrar al login → mandarlo al admin
  if (pathname === '/admin/login' && authCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Si no está autenticado e intenta acceder a cualquier ruta admin (excepto login) → login
  if (pathname !== '/admin/login' && !authCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
