'use client'
import { useState, useMemo } from 'react'

export type LeadRow = {
  id: string
  email: string
  mensaje: string
  tipo: string | null
  status: string
  source: string
  createdAt: string
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

export function LeadsTable({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [leads, setLeads]           = useState(initialLeads)
  const [search, setSearch]         = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortDir, setSortDir]       = useState<SortDir>('desc')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId]   = useState<string | null>(null)
  const [expanded, setExpanded]     = useState<string | null>(null)

  const filtered = useMemo(() => {
    let r = [...leads]
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(l => l.email.toLowerCase().includes(q) || l.mensaje.toLowerCase().includes(q))
    }
    if (filterTipo !== 'all')    r = r.filter(l => l.tipo === filterTipo)
    if (filterStatus !== 'all')  r = r.filter(l => l.status === filterStatus)
    r.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === 'desc' ? -diff : diff
    })
    return r
  }, [leads, search, filterTipo, filterStatus, sortDir])

  async function updateStatus(id: string, status: Status) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por email o mensaje…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            ...sel,
            flex: '1 1 220px',
            paddingLeft: 12,
          }}
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
      </div>

      {/* Count + active filters */}
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
          <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 6 }}>
            Sin resultados
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            Prueba con otros filtros o términos de búsqueda.
          </div>
        </div>
      ) : (
        <div
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
            const cfg = STATUS_CONFIG[lead.status as Status] ?? STATUS_CONFIG.new
            const isExpanded = expanded === lead.id
            const isHovered  = hoveredId === lead.id
            const isUpdating = updatingId === lead.id

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
                {/* Main row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '220px 1fr 110px 140px 130px',
                    padding: '13px 16px',
                    alignItems: 'start',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpanded(isExpanded ? null : lead.id)}
                >
                  {/* Email */}
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--accent)',
                      fontWeight: 500,
                      paddingRight: 12,
                      wordBreak: 'break-all',
                      lineHeight: 1.4,
                    }}
                  >
                    {lead.email}
                  </div>

                  {/* Mensaje preview */}
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--muted)',
                      paddingRight: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    {isExpanded
                      ? lead.mensaje
                      : lead.mensaje.length > 90
                      ? lead.mensaje.slice(0, 90) + '…'
                      : lead.mensaje}
                  </div>

                  {/* Tipo */}
                  <div style={{ paddingRight: 8 }}>
                    {lead.tipo ? (
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
                        {TIPO_LABELS[lead.tipo] ?? lead.tipo}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--subtle)', fontSize: 12 }}>—</span>
                    )}
                  </div>

                  {/* Status dropdown */}
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value as Status)}
                      disabled={isUpdating}
                      style={{
                        fontSize: 11,
                        padding: '4px 8px',
                        borderRadius: 6,
                        background: cfg.bg,
                        border: `1px solid ${cfg.color}40`,
                        color: cfg.color,
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
                  </div>

                  {/* Fecha */}
                  <div style={{ fontSize: 12, color: 'var(--subtle)', lineHeight: 1.4 }}>
                    {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                    <br />
                    <span style={{ opacity: 0.7 }}>
                      {new Date(lead.createdAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
