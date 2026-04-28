'use client'
import { useState, useMemo, useEffect } from 'react'

export type LeadRow = {
  id: string
  email: string
  mensaje: string
  tipo: string | null
  status: string
  source: string
  createdAt: string
  aiResponse: string | null
  aiResponseAt: string | null
  aiError: string | null
}

type SortDir = 'desc' | 'asc'
type Status = 'new' | 'contacted' | 'closed'

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  new:       { label: 'Nuevo',       color: '#4f7cff', bg: 'rgba(79,124,255,0.12)' },
  contacted: { label: 'Contactado',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  closed:    { label: 'Cerrado',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
}

const TIPO_LABELS: Record<string, string> = {
  negocio:   'Negocio',
  idea:      'Idea',
  'no-claro': 'Sin definir',
}

const sel: React.CSSProperties = {
  padding: '7px 11px',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  outline: 'none',
  cursor: 'pointer',
}

const btn: React.CSSProperties = {
  padding: '7px 13px',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
}

function StatusSelect({
  lead,
  isUpdating,
  isError,
  onUpdate,
}: {
  lead: LeadRow
  isUpdating: boolean
  isError: boolean
  onUpdate: (id: string, status: Status) => void
}) {
  const [localValue, setLocalValue] = useState<Status>(lead.status as Status)

  // Sync if parent status changes (successful PATCH or error rollback)
  useEffect(() => { setLocalValue(lead.status as Status) }, [lead.status])

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation()
    const newStatus = e.target.value as Status
    setLocalValue(newStatus)
    onUpdate(lead.id, newStatus)
  }

  const cfg = STATUS_CONFIG[localValue] ?? STATUS_CONFIG.new
  return (
    <select
      value={localValue}
      onChange={handleChange}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      disabled={isUpdating}
      title={isError ? 'Error al actualizar — revisa la consola' : undefined}
      style={{
        fontSize: 11,
        padding: '4px 8px',
        borderRadius: 6,
        background: isError ? 'rgba(239,68,68,0.1)' : cfg.bg,
        border: isError ? '1px solid rgba(239,68,68,0.6)' : `1px solid ${cfg.color}40`,
        color: isError ? '#ef4444' : cfg.color,
        cursor: isUpdating ? 'wait' : 'pointer',
        outline: 'none',
        fontWeight: 600,
        opacity: isUpdating ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
      ))}
    </select>
  )
}

function AiResponsePanel({
  lead,
  isGenerating,
  isCopied,
  isDeleting,
  onGenerate,
  onCopy,
  onDelete,
}: {
  lead: LeadRow
  isGenerating: boolean
  isCopied: boolean
  isDeleting: boolean
  onGenerate: (id: string, force?: boolean) => void
  onCopy: (id: string, text: string) => void
  onDelete: (id: string, email: string) => void
}) {
  const hasResponse = !!lead.aiResponse
  const hasError    = !!lead.aiError && !hasResponse

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        padding: '14px 16px 16px',
        borderTop: '1px dashed var(--border)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Respuesta IA
        </div>
        {lead.aiResponseAt && (
          <div style={{ fontSize: 11, color: 'var(--subtle)' }}>
            generada {new Date(lead.aiResponseAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        <div style={{ flex: 1 }} />
        {hasResponse && (
          <button
            onClick={() => onCopy(lead.id, lead.aiResponse!)}
            style={{
              ...btn,
              padding: '5px 10px',
              fontSize: 11,
              color: isCopied ? '#10b981' : 'var(--text)',
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
            padding: '5px 10px',
            fontSize: 11,
            opacity: isGenerating ? 0.6 : 1,
            cursor: isGenerating ? 'wait' : 'pointer',
            color: 'var(--accent)',
            borderColor: 'var(--accent)',
          }}
        >
          {isGenerating
            ? 'Generando…'
            : hasResponse
            ? 'Regenerar'
            : 'Generar respuesta'}
        </button>
      </div>

      {hasResponse && (
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--text)',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
          }}
        >
          {lead.aiResponse}
        </div>
      )}

      {!hasResponse && !hasError && !isGenerating && (
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Aún no se ha generado una respuesta para este lead.
        </div>
      )}

      {hasError && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 12,
            color: '#ef4444',
          }}
        >
          Error al generar: {lead.aiError}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => onDelete(lead.id, lead.email)}
          disabled={isDeleting}
          style={{
            ...btn,
            padding: '5px 10px',
            fontSize: 11,
            color: '#ef4444',
            borderColor: 'rgba(239,68,68,0.4)',
            opacity: isDeleting ? 0.6 : 1,
            cursor: isDeleting ? 'wait' : 'pointer',
          }}
        >
          {isDeleting ? 'Eliminando…' : 'Eliminar lead'}
        </button>
      </div>
    </div>
  )
}

function TipoBadge({ tipo }: { tipo: string | null }) {
  if (!tipo) return <span style={{ color: 'var(--subtle)', fontSize: 12 }}>—</span>
  return (
    <span
      style={{
        fontSize: 11,
        padding: '3px 8px',
        borderRadius: 5,
        background: 'rgba(155,92,255,0.1)',
        color: 'var(--accent2)',
        border: '1px solid rgba(155,92,255,0.2)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {TIPO_LABELS[tipo] ?? tipo}
    </span>
  )
}

export function LeadsTable({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [leads, setLeads]               = useState(initialLeads)
  const [search, setSearch]             = useState('')
  const [filterTipo, setFilterTipo]     = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortDir, setSortDir]           = useState<SortDir>('desc')
  const [updatingId, setUpdatingId]     = useState<string | null>(null)
  const [errorId, setErrorId]           = useState<string | null>(null)
  const [hoveredId, setHoveredId]       = useState<string | null>(null)
  const [expanded, setExpanded]         = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [copiedId, setCopiedId]         = useState<string | null>(null)
  const [deletingId, setDeletingId]     = useState<string | null>(null)

  const filtered = useMemo(() => {
    let r = [...leads]
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(l => l.email.toLowerCase().includes(q) || l.mensaje.toLowerCase().includes(q))
    }
    if (filterTipo !== 'all')   r = r.filter(l => l.tipo === filterTipo)
    if (filterStatus !== 'all') r = r.filter(l => l.status === filterStatus)
    r.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === 'desc' ? -diff : diff
    })
    return r
  }, [leads, search, filterTipo, filterStatus, sortDir])

  async function generateAi(id: string, force = false) {
    setGeneratingId(id)
    try {
      const res = await fetch(`/api/leads/${id}/generate-response${force ? '?force=1' : ''}`, {
        method: 'POST',
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.response) {
        setLeads(prev => prev.map(l =>
          l.id === id
            ? { ...l, aiResponse: data.response, aiResponseAt: new Date().toISOString(), aiError: null }
            : l
        ))
      } else {
        const message = data.error ?? `HTTP ${res.status}`
        console.error('[leads] generateAi failed:', message)
        setLeads(prev => prev.map(l => l.id === id ? { ...l, aiError: message } : l))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[leads] generateAi error:', message)
      setLeads(prev => prev.map(l => l.id === id ? { ...l, aiError: message } : l))
    } finally {
      setGeneratingId(null)
    }
  }

  async function copyToClipboard(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(c => c === id ? null : c), 1600)
    } catch (err) {
      console.error('[leads] clipboard error:', err)
    }
  }

  async function deleteLead(id: string, email: string) {
    if (!window.confirm(`¿Eliminar el lead de ${email}?\nEsta acción no se puede deshacer.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id))
        if (expanded === id) setExpanded(null)
      } else {
        console.error('[leads] DELETE failed:', res.status)
      }
    } catch (err) {
      console.error('[leads] deleteLead error:', err)
    } finally {
      setDeletingId(null)
    }
  }

async function updateStatus(id: string, status: Status) {
  setUpdatingId(id)
  setErrorId(null)

  try {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      setLeads(prev =>
        prev.map(l => l.id === id ? { ...l, status } : l)
      )
    } else {
      const body = await res.text()
      console.error('[leads] PATCH failed:', res.status, body)
      setErrorId(id)
    }

  } catch (err) {
    console.error('[leads] updateStatus error:', err)
    setErrorId(id)
  } finally {
    setUpdatingId(null)
  }
}

  return (
    <div>
      {/* Toolbar */}
      <div
        className="admin-leads-toolbar"
        style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <input
          type="text"
          placeholder="Buscar por email o mensaje…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...sel, flex: '1 1 220px', paddingLeft: 12 }}
        />
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} style={sel}>
          <option value="all">Todos los tipos</option>
          <option value="negocio">Negocio</option>
          <option value="idea">Idea</option>
          <option value="no-claro">Sin definir</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={sel}>
          <option value="all">Todos los estados</option>
          <option value="new">Nuevo</option>
          <option value="contacted">Contactado</option>
          <option value="closed">Cerrado</option>
        </select>
        <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')} style={btn}>
          Fecha {sortDir === 'desc' ? '↓' : '↑'}
        </button>
        <button onClick={() => { window.location.href = '/api/leads/export' }} style={btn}>
          Exportar CSV
        </button>
      </div>

      {/* Count + clear filters */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} de {leads.length} leads
        {(search || filterTipo !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={() => { setSearch(''); setFilterTipo('all'); setFilterStatus('all') }}
            style={{
              marginLeft: 10,
              fontSize: 11,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Limpiar filtros ×
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '56px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>◌</div>
          <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 6 }}>Sin resultados</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            Prueba con otros filtros o términos de búsqueda.
          </div>
        </div>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div
            className="admin-table-desktop"
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr 110px 140px 130px',
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                fontSize: 11,
                color: 'var(--subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                fontWeight: 600,
              }}
            >
              <div>Email</div>
              <div>Mensaje</div>
              <div>Tipo</div>
              <div>Estado</div>
              <div>Fecha</div>
            </div>

            {/* Rows */}
            {filtered.map((lead, i) => {
              const isExpanded   = expanded === lead.id
              const isHovered    = hoveredId === lead.id
              const isUpdating   = updatingId === lead.id
              const isError      = errorId === lead.id
              const isGenerating = generatingId === lead.id
              const isCopied     = copiedId === lead.id

              return (
                <div
                  key={lead.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    background: isHovered ? 'var(--bg3)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setHoveredId(lead.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr 110px 140px 130px',
                      padding: '13px 16px',
                      alignItems: 'start',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName === 'SELECT') return
                      setExpanded(isExpanded ? null : lead.id)
                    }}
                  >
                    <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, paddingRight: 12, wordBreak: 'break-all', lineHeight: 1.4 }}>
                      {lead.email}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', paddingRight: 12, lineHeight: 1.5 }}>
                      {isExpanded
                        ? lead.mensaje
                        : lead.mensaje.length > 90
                        ? lead.mensaje.slice(0, 90) + '…'
                        : lead.mensaje}
                    </div>
                    <div style={{ paddingRight: 8 }}>
                      <TipoBadge tipo={lead.tipo} />
                    </div>
                    <div>
                      <StatusSelect lead={lead} isUpdating={isUpdating} isError={isError} onUpdate={updateStatus} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--subtle)', lineHeight: 1.4 }}>
                      {new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      <br />
                      <span style={{ opacity: 0.7 }}>
                        {new Date(lead.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <AiResponsePanel
                      lead={lead}
                      isGenerating={isGenerating}
                      isCopied={isCopied}
                      isDeleting={deletingId === lead.id}
                      onGenerate={generateAi}
                      onCopy={copyToClipboard}
                      onDelete={deleteLead}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Mobile cards ── */}
          <div className="admin-table-mobile">
            {filtered.map(lead => {
              const isExpanded   = expanded === lead.id
              const isUpdating   = updatingId === lead.id
              const isError      = errorId === lead.id
              const isGenerating = generatingId === lead.id
              const isCopied     = copiedId === lead.id

              return (
                <div
                  key={lead.id}
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName === 'SELECT') return
                    setExpanded(isExpanded ? null : lead.id)
                  }}
                >
                  {/* Email + date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, wordBreak: 'break-all', flex: 1, paddingRight: 12, lineHeight: 1.4 }}>
                      {lead.email}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--subtle)', flexShrink: 0, textAlign: 'right', lineHeight: 1.5 }}>
                      {new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      <br />
                      <span style={{ opacity: 0.7 }}>
                        {new Date(lead.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>
                    {isExpanded
                      ? lead.mensaje
                      : lead.mensaje.length > 100
                      ? lead.mensaje.slice(0, 100) + '…'
                      : lead.mensaje}
                  </div>

                  {/* Tipo + status */}
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <TipoBadge tipo={lead.tipo} />
                    <StatusSelect lead={lead} isUpdating={isUpdating} isError={isError} onUpdate={updateStatus} />
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 12, marginLeft: -16, marginRight: -16, marginBottom: -16 }}>
                      <AiResponsePanel
                        lead={lead}
                        isGenerating={isGenerating}
                        isCopied={isCopied}
                        isDeleting={deletingId === lead.id}
                        onGenerate={generateAi}
                        onCopy={copyToClipboard}
                        onDelete={deleteLead}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
