import { cookies } from 'next/headers'
import { AdminShell } from '@/components/admin/AdminShell'

export const metadata = {
  title: 'Admin — Nández García',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = cookies().has('admin-auth')

  // Login page: sin sidebar ni chrome de admin
  if (!isAuthenticated) {
    return <>{children}</>
  }

  return <AdminShell>{children}</AdminShell>
}
