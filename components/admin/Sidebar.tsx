'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/admin',
    label: 'Overview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".9" />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".5" />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".5" />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".9" />
      </svg>
    ),
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="4" r="2.5" fill="currentColor" opacity=".9" />
        <path d="M2 12c0-3.038 2.462-5.5 5.5-5.5S13 8.962 13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
      </svg>
    ),
  },
] as const

function LogoutButton({ onClose }: { onClose?: () => void }) {
  async function handleLogout() {
    onClose?.()
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 8,
        fontSize: 12,
        color: 'var(--subtle)',
        background: 'transparent',
        border: '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#ef4444'
        e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--subtle)'
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
        <path
          d="M3 1h6a1 1 0 011 1v2h-1V2H3v11h6v-2h1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z"
          fill="currentColor"
        />
        <path
          d="M10.5 10l2.5-2.5L10.5 5M13 7.5H6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      Cerrar sesión
    </button>
  )
}

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <aside
      className={`admin-sidebar${isOpen ? ' admin-sidebar--open' : ''}`}
      style={{
        width: 220,
        flexShrink: 0,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand */}
      <div style={{ padding: '0 8px 24px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Nández García
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--muted)',
            marginTop: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
          Admin CRM
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: 'var(--subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '0 8px',
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          Menú
        </div>
        {NAV.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => onClose?.()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text)' : 'var(--muted)',
                background: isActive ? 'var(--bg3)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                border: isActive ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <span style={{ color: isActive ? 'var(--accent)' : 'var(--subtle)', display: 'flex' }}>
                {icon}
              </span>
              {label}
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div style={{ padding: '16px 8px 0', borderTop: '1px solid var(--border)' }}>
        <LogoutButton onClose={onClose} />
      </div>
    </aside>
  )
}
