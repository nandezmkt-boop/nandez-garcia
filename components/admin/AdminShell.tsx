'use client'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { ToastProvider } from './Toast'
import { ConfirmProvider } from './ConfirmDialog'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <ConfirmProvider>
      {/* Mobile-only top bar */}
      <div className="admin-mobile-bar">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Nández García
        </div>
        {/* spacer to keep title centered */}
        <div style={{ width: 34 }} />
      </div>

      <div className="admin-layout">
        {/* Overlay backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="admin-content">
          {children}
        </div>
      </div>
      </ConfirmProvider>
    </ToastProvider>
  )
}
