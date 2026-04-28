'use client'
import { useEffect } from 'react'
import {
  type LeadRow,
  type Status,
  StatusSelect,
  TipoBadge,
  relativeTime,
} from './leads-shared'

const btn: React.CSSProperties = {
  padding: '7px 12px',
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 7,
  color: 'var(--text)',
  fontSize: 12,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontWeight: 500,
}

export function LeadDetailDrawer({
  lead,
  isGenerating,
  isCopied,
  isDeleting,
  isUpdating,
  isError,
  onClose,
  onGenerate,
  onCopy,
  onDelete,
  onUpdateStatus,
}: {
  lead: LeadRow | null
  isGenerating: boolean
  isCopied: boolean
  isDeleting: boolean
  isUpdating: boolean
  isError: boolean
  onClose: () => void
  onGenerate: (id: string, force?: boolean) => void
  onCopy: (id: string, text: string) => void
  onDelete: (id: string, email: string) => void
  onUpdateStatus: (id: string, status: Status) => void
}) {
  useEffect(() => {
    if (!lead) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lead, onClose])

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!lead) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [lead])

  if (!lead) return null

  const hasResponse = !!lead.aiResponse
  const hasError    = !!lead.aiError && !hasResponse

  function replyByEmail() {
    if (!lead) return
    const subject = `Re: Tu mensaje a Nández García`
    const body    = lead.aiResponse ?? ''
    window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8,9,14,0.55)',
          backdropFilter: 'blur(2px)',
          zIndex: 9000,
          animation: 'admin-drawer-fade 0.18s ease-out',
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Lead ${lead.email}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(540px, 100vw)',
          background: 'var(--bg2)',
          borderLeft: '1px solid var(--border)',
          zIndex: 9001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.4)',
          animation: 'admin-drawer-in 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(79,124,255,0.25), rgba(155,92,255,0.18))',
              border: '1px solid rgba(79,124,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            {lead.email[0]?.toUpperCase() ?? '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                color: 'var(--text)',
                fontWeight: 600,
                wordBreak: 'break-all',
                lineHeight: 1.3,
              }}
            >
              {lead.email}
            </div>
            <div style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 3, letterSpacing: '0.01em' }}>
              {relativeTime(lead.createdAt)} · {lead.source}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              fontSize: 24,
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
              borderRadius: 6,
            }}
          >
            ×
          </button>
        </header>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
          {/* Badges row */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 24,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TipoBadge tipo={lead.tipo} />
            <StatusSelect
              lead={lead}
              isUpdating={isUpdating}
              isError={isError}
              onUpdate={onUpdateStatus}
              size="md"
            />
          </div>

          {/* Mensaje */}
          <SectionTitle>Mensaje del lead</SectionTitle>
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px 16px',
              fontSize: 13,
              color: 'var(--text)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              marginBottom: 24,
            }}
          >
            {lead.mensaje}
          </div>

          {/* AI Response */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div>
              <SectionTitle inline>Respuesta IA</SectionTitle>
              {lead.aiResponseAt && (
                <span style={{ fontSize: 11, color: 'var(--subtle)', marginLeft: 8 }}>
                  · {relativeTime(lead.aiResponseAt)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {hasResponse && (
                <button
                  onClick={() => onCopy(lead.id, lead.aiResponse!)}
                  style={{
                    ...btn,
                    fontSize: 11,
                    padding: '5px 10px',
                    color: isCopied ? '#10b981' : 'var(--text)',
                    borderColor: isCopied ? 'rgba(16,185,129,0.4)' : 'var(--border)',
                  }}
                >
                  {isCopied ? 'Copiado ✓' : 'Copiar'}
                </button>
              )}
              <button
                onClick={() => onGenerate(lead.id, hasResponse)}
                disabled={isGenerating}
                style={{
                  ...btn,
                  fontSize: 11,
                  padding: '5px 10px',
                  color: 'var(--accent)',
                  borderColor: 'rgba(79,124,255,0.4)',
                  background: 'rgba(79,124,255,0.08)',
                  opacity: isGenerating ? 0.6 : 1,
                  cursor: isGenerating ? 'wait' : 'pointer',
                }}
              >
                {isGenerating
                  ? 'Generando…'
                  : hasResponse
                  ? 'Regenerar'
                  : 'Generar'}
              </button>
            </div>
          </div>

          {hasResponse ? (
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '14px 16px',
                fontSize: 13,
                color: 'var(--text)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {lead.aiResponse}
            </div>
          ) : hasError ? (
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 12,
                color: '#ef4444',
                lineHeight: 1.5,
              }}
            >
              Error al generar: {lead.aiError}
            </div>
          ) : (
            <div
              style={{
                border: '1px dashed var(--border)',
                borderRadius: 8,
                padding: '20px 16px',
                fontSize: 12,
                color: 'var(--muted)',
                textAlign: 'center',
              }}
            >
              Aún no hay respuesta generada para este lead.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <footer
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            background: 'var(--bg)',
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => onCopy(`email-${lead.id}`, lead.email)} style={btn}>
              Copiar email
            </button>
            <button
              onClick={replyByEmail}
              disabled={!hasResponse}
              title={hasResponse ? '' : 'Genera primero la respuesta IA'}
              style={{
                ...btn,
                color: hasResponse ? 'var(--accent)' : 'var(--subtle)',
                borderColor: hasResponse ? 'rgba(79,124,255,0.4)' : 'var(--border)',
                background: hasResponse ? 'rgba(79,124,255,0.1)' : 'var(--bg3)',
                cursor: hasResponse ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              Responder por email →
            </button>
          </div>
          <button
            onClick={() => onDelete(lead.id, lead.email)}
            disabled={isDeleting}
            style={{
              ...btn,
              color: '#ef4444',
              borderColor: 'rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.06)',
              opacity: isDeleting ? 0.6 : 1,
              cursor: isDeleting ? 'wait' : 'pointer',
            }}
          >
            {isDeleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </footer>
      </aside>

      <style>{`
        @keyframes admin-drawer-fade {
          from { opacity: 0 } to { opacity: 1 }
        }
        @keyframes admin-drawer-in {
          from { transform: translateX(100%) }
          to   { transform: translateX(0) }
        }
      `}</style>
    </>
  )
}

function SectionTitle({ children, inline = false }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--accent2)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: inline ? 0 : 10,
        display: inline ? 'inline' : 'block',
      }}
    >
      {children}
    </div>
  )
}
