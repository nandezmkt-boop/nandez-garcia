'use client'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastVariant = 'success' | 'error' | 'info'
type Toast = { id: string; variant: ToastVariant; message: string }

type ToastApi = {
  success: (message: string) => void
  error:   (message: string) => void
  info:    (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const VARIANT_STYLES: Record<ToastVariant, { accent: string; icon: string }> = {
  success: { accent: '#10b981', icon: '✓' },
  error:   { accent: '#ef4444', icon: '✕' },
  info:    { accent: '#4f7cff', icon: 'i' },
}

const TOAST_TTL_MS = 3500
const MAX_VISIBLE  = 4

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback((variant: ToastVariant, message: string) => {
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-(MAX_VISIBLE - 1)), { id, variant, message }])
    setTimeout(() => dismiss(id), TOAST_TTL_MS)
  }, [dismiss])

  const api: ToastApi = {
    success: msg => push('success', msg),
    error:   msg => push('error',   msg),
    info:    msg => push('info',    msg),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        {toasts.map(t => {
          const v = VARIANT_STYLES[t.variant]
          return (
            <div
              key={t.id}
              onClick={() => dismiss(t.id)}
              style={{
                pointerEvents: 'auto',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${v.accent}`,
                borderRadius: 8,
                padding: '10px 14px',
                minWidth: 240,
                maxWidth: 360,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: 'var(--text)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                cursor: 'pointer',
                animation: 'admin-toast-in 0.18s ease-out',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: `${v.accent}22`,
                  color: v.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {v.icon}
              </span>
              <span style={{ lineHeight: 1.4 }}>{t.message}</span>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes admin-toast-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
