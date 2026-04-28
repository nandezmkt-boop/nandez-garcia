'use client'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type ConfirmOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?:  string
  variant?: 'default' | 'danger'
}

type ConfirmApi = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmApi | null>(null)

export function useConfirm(): ConfirmApi {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}

type State = { options: ConfirmOptions; resolve: (v: boolean) => void } | null

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(null)

  const confirm: ConfirmApi = useCallback(options => {
    return new Promise<boolean>(resolve => setState({ options, resolve }))
  }, [])

  const close = useCallback((value: boolean) => {
    setState(curr => {
      if (curr) curr.resolve(value)
      return null
    })
  }, [])

  useEffect(() => {
    if (!state) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close(false)
      else if (e.key === 'Enter') close(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          onClick={() => close(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(8, 9, 14, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'admin-confirm-fade 0.15s ease-out',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '22px 24px',
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'admin-confirm-pop 0.18s ease-out',
            }}
          >
            <h3
              id="admin-confirm-title"
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '-0.01em',
              }}
            >
              {state.options.title}
            </h3>
            {state.options.description && (
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                {state.options.description}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 22,
              }}
            >
              <button
                type="button"
                onClick={() => close(false)}
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {state.options.cancelLabel ?? 'Cancelar'}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: state.options.variant === 'danger' ? 'rgba(239,68,68,0.5)' : 'var(--accent)',
                  background:  state.options.variant === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(79,124,255,0.15)',
                  color:       state.options.variant === 'danger' ? '#ef4444' : 'var(--accent)',
                }}
              >
                {state.options.confirmLabel ?? 'Confirmar'}
              </button>
            </div>
          </div>
          <style>{`
            @keyframes admin-confirm-fade {
              from { opacity: 0 } to { opacity: 1 }
            }
            @keyframes admin-confirm-pop {
              from { opacity: 0; transform: scale(0.97) translateY(4px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
