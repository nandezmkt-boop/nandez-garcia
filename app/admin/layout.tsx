import { cookies } from 'next/headers'
import { Sidebar } from '@/components/admin/Sidebar'

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

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '36px 40px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
