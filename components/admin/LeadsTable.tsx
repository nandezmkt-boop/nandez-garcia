'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useToast } from './Toast'
import { useConfirm } from './ConfirmDialog'
import {
  type LeadRow,
  type Status,
  STATUS_CONFIG,
  StatusSelect,
  TipoBadge,
  TemperatureBadge,
  ScorePill,
} from './leads-shared'
import { LeadDetailDrawer } from './LeadDetailDrawer'
import { BulkActionsBar } from './BulkActionsBar'

export type { LeadRow }

type SortDir   = 'desc' | 'asc'
type SortField = 'date' | 'score'

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

const GRID_COLS = '32px 195px 1fr 100px 100px 140px 110px'

export function LeadsTable({ initialLeads }: { initialLeads: LeadRow[] }) {
  const toast        = useToast()
  const confirm      = useConfirm()
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const [leads, setLeads]               = useState(initialLeads)
  const [search, setSearch]             = useState(() => searchParams.get('q') ?? '')
  const [filterTipo, setFilterTipo]     = useState(() => searchParams.get('tipo') ?? 'all')
  const [filterStatus, setFilterStatus] = useState(() => searchParams.get('status') ?? 'all')
  const [sortDir, setSortDir]           = useState<SortDir>(() =>
    searchParams.get('sort') === 'asc' ? 'asc' : 'desc'
  )
  const [sortField, setSortField]       = useState<SortField>(() =>
    searchParams.get('sortBy') === 'score' ? 'score' : 'date'
  )

  const [updatingId, setUpdatingId]     = useState<string | null>(null)
  const [errorId, setErrorId]           = useState<string | null>(null)
  const [hoveredId, setHoveredId]       = useState<string | null>(null)
  const [selectedId, setSelectedId]     = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [copiedId, setCopiedId]         = useState<string | null>(null)
  const [deletingId, setDeletingId]     = useState<string | null>(null)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkWorking, setIsBulkWorking] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)

  // ── Sync filters → URL (debounced for search input) ──────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams()
      if (search)                  params.set('q',      search)
      if (filterTipo   !== 'all')  params.set('tipo',   filterTipo)
      if (filterStatus !== 'all')  params.set('status', filterStatus)
      if (sortDir      !== 'desc') params.set('sort',   sortDir)
      if (sortField    !== 'date') params.set('sortBy', sortField)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, 200)
    return () => clearTimeout(t)
  }, [search, filterTipo, filterStatus, sortDir, pathname, router])

  // ── Filter + sort ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = [...leads]
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(l => l.email.toLowerCase().includes(q) || l.mensaje.toLowerCase().includes(q))
    }
    if (filterTipo   !== 'all') r = r.filter(l => l.tipo === filterTipo)
    if (filterStatus !== 'all') r = r.filter(l => l.status === filterStatus)
    r.sort((a, b) => {
      const diff = sortField === 'score'
        ? a.score - b.score
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === 'desc' ? -diff : diff
    })
    return r
  }, [leads, search, filterTipo, filterStatus, sortDir])

  // ── Bulk selection helpers ──────────────────────────────────────────
  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  const allFilteredSelected =
    filtered.length > 0 && filtered.every(l => selectedIds.has(l.id))

  function toggleSelectAllFiltered() {
    if (allFilteredSelected) {
      // Remove all filtered ones from selection
      setSelectedIds(prev => {
        const next = new Set(prev)
        filtered.forEach(l => next.delete(l.id))
        return next
      })
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev)
        filtered.forEach(l => next.add(l.id))
        return next
      })
    }
  }

  // ── Bulk actions ────────────────────────────────────────────────────
  async function bulkUpdateStatus(status: Status) {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBulkWorking(true)

    const results = await Promise.all(ids.map(async id => {
      try {
        const res = await fetch(`/api/leads/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
        return { id, ok: res.ok }
      } catch {
        return { id, ok: false }
      }
    }))

    const okIds   = new Set(results.filter(r => r.ok).map(r => r.id))
    const okCount = okIds.size
    const errCount = results.length - okCount

    if (okCount > 0) {
      setLeads(prev => prev.map(l => okIds.has(l.id) ? { ...l, status } : l))
    }
    if (errCount === 0) {
      toast.success(`${okCount} lead${okCount !== 1 ? 's' : ''} → ${STATUS_CONFIG[status].label}`)
    } else if (okCount === 0) {
      toast.error('No se pudo actualizar ningún lead')
    } else {
      toast.info(`${okCount} actualizados, ${errCount} con error`)
    }

    clearSelection()
    setIsBulkWorking(false)
  }

  async function bulkDelete() {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return

    const ok = await confirm({
      title: `Eliminar ${ids.length} lead${ids.length !== 1 ? 's' : ''}`,
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
    })
    if (!ok) return

    setIsBulkWorking(true)

    const results = await Promise.all(ids.map(async id => {
      try {
        const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
        return { id, ok: res.ok }
      } catch {
        return { id, ok: false }
      }
    }))

    const okIds    = new Set(results.filter(r => r.ok).map(r => r.id))
    const okCount  = okIds.size
    const errCount = results.length - okCount

    if (okCount > 0) {
      setLeads(prev => prev.filter(l => !okIds.has(l.id)))
      if (selectedId && okIds.has(selectedId)) setSelectedId(null)
    }
    if (errCount === 0) {
      toast.success(`${okCount} lead${okCount !== 1 ? 's' : ''} eliminado${okCount !== 1 ? 's' : ''}`)
    } else if (okCount === 0) {
      toast.error('No se pudo eliminar ningún lead')
    } else {
      toast.info(`${okCount} eliminados, ${errCount} con error`)
    }

    clearSelection()
    setIsBulkWorking(false)
  }

  // ── Single-lead actions ─────────────────────────────────────────────
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
        toast.success(force ? 'Respuesta regenerada' : 'Respuesta generada')
      } else {
        const message = data.error ?? `HTTP ${res.status}`
        console.error('[leads] generateAi failed:', message)
        setLeads(prev => prev.map(l => l.id === id ? { ...l, aiError: message } : l))
        toast.error('No se pudo generar la respuesta')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[leads] generateAi error:', message)
      setLeads(prev => prev.map(l => l.id === id ? { ...l, aiError: message } : l))
      toast.error('Error de red al generar respuesta')
    } finally {
      setGeneratingId(null)
    }
  }

  async function copyToClipboard(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(c => c === id ? null : c), 1600)
      toast.success('Copiado al portapapeles')
    } catch (err) {
      console.error('[leads] clipboard error:', err)
      toast.error('No se pudo copiar')
    }
  }

  async function deleteLead(id: string, email: string) {
    const ok = await confirm({
      title: 'Eliminar lead',
      description: `Vas a eliminar el lead de ${email}. Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
    })
    if (!ok) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id))
        if (selectedId === id) setSelectedId(null)
        setSelectedIds(prev => {
          if (!prev.has(id)) return prev
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        toast.success('Lead eliminado')
      } else {
        console.error('[leads] DELETE failed:', res.status)
        toast.error('No se pudo eliminar el lead')
      }
    } catch (err) {
      console.error('[leads] deleteLead error:', err)
      toast.error('Error de red al eliminar')
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
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
        toast.success(`Estado actualizado a ${STATUS_CONFIG[status].label}`)
      } else {
        const body = await res.text()
        console.error('[leads] PATCH failed:', res.status, body)
        setErrorId(id)
        toast.error('No se pudo actualizar el estado')
      }
    } catch (err) {
      console.error('[leads] updateStatus error:', err)
      setErrorId(id)
      toast.error('Error de red al actualizar')
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      const isTyping = !!t && (
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' ||
        t.tagName === 'SELECT' ||
        t.isContentEditable
      )
      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      // Esc clears selection only when no drawer is open and user isn't typing
      if (e.key === 'Escape' && !isTyping && !selectedId && selectedIds.size > 0) {
        clearSelection()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, selectedIds.size])

  const selectedLead = selectedId ? leads.find(l => l.id === selectedId) ?? null : null

  return (
    <div>
      {/* Toolbar */}
      <div
        className="admin-leads-toolbar"
        style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <input
          ref={searchRef}
          type="text"
          placeholder="Buscar por email o mensaje…  (pulsa /)"
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
        <button
          onClick={() => {
            if (sortField !== 'date') { setSortField('date'); setSortDir('desc') }
            else setSortDir(d => d === 'desc' ? 'asc' : 'desc')
          }}
          style={{ ...btn, color: sortField === 'date' ? 'var(--accent)' : 'var(--text)' }}
        >
          Fecha {sortField === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </button>
        <button
          onClick={() => {
            if (sortField !== 'score') { setSortField('score'); setSortDir('desc') }
            else setSortDir(d => d === 'desc' ? 'asc' : 'desc')
          }}
          style={{ ...btn, color: sortField === 'score' ? 'var(--accent)' : 'var(--text)' }}
        >
          Score {sortField === 'score' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
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
                gridTemplateColumns: GRID_COLS,
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                fontSize: 11,
                color: 'var(--subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                fontWeight: 600,
                alignItems: 'center',
              }}
            >
              <div onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAllFiltered}
                  aria-label="Seleccionar todos los visibles"
                  style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
                />
              </div>
              <div>Email</div>
              <div>Mensaje</div>
              <div>Tipo</div>
              <div>Temp / Score</div>
              <div>Estado</div>
              <div>Fecha</div>
            </div>

            {/* Rows */}
            {filtered.map((lead, i) => {
              const isHovered  = hoveredId === lead.id
              const isUpdating = updatingId === lead.id
              const isError    = errorId === lead.id
              const isSelected = selectedId === lead.id
              const isChecked  = selectedIds.has(lead.id)

              return (
                <div
                  key={lead.id}
                  onMouseEnter={() => setHoveredId(lead.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => {
                    const tag = (e.target as HTMLElement).tagName
                    if (tag === 'SELECT' || tag === 'INPUT') return
                    setSelectedId(lead.id)
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: GRID_COLS,
                    padding: '13px 16px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    background: isSelected
                      ? 'rgba(79,124,255,0.08)'
                      : isChecked
                      ? 'rgba(79,124,255,0.04)'
                      : isHovered
                      ? 'var(--bg3)'
                      : 'transparent',
                    borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'background 0.1s, border-color 0.1s',
                  }}
                >
                  <div onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(lead.id)}
                      aria-label={`Seleccionar lead de ${lead.email}`}
                      style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
                    />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, paddingRight: 12, wordBreak: 'break-all', lineHeight: 1.4 }}>
                    {lead.email}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', paddingRight: 12, lineHeight: 1.5 }}>
                    {lead.mensaje.length > 90 ? lead.mensaje.slice(0, 90) + '…' : lead.mensaje}
                  </div>
                  <div style={{ paddingRight: 8 }}>
                    <TipoBadge tipo={lead.tipo} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 8 }}>
                    <TemperatureBadge temperature={lead.temperature} score={lead.score} />
                    <ScorePill score={lead.score} />
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
              )
            })}
          </div>

          {/* ── Mobile cards ── */}
          <div className="admin-table-mobile">
            {filtered.map(lead => {
              const isUpdating = updatingId === lead.id
              const isError    = errorId === lead.id
              const isSelected = selectedId === lead.id
              const isChecked  = selectedIds.has(lead.id)

              return (
                <div
                  key={lead.id}
                  onClick={(e) => {
                    const tag = (e.target as HTMLElement).tagName
                    if (tag === 'SELECT' || tag === 'INPUT') return
                    setSelectedId(lead.id)
                  }}
                  style={{
                    background: isChecked ? 'rgba(79,124,255,0.04)' : 'var(--bg2)',
                    border: isSelected
                      ? '1px solid var(--accent)'
                      : isChecked
                      ? '1px solid rgba(79,124,255,0.4)'
                      : '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                    position: 'relative',
                  }}
                >
                  {/* Email + checkbox + date */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <div onClick={e => e.stopPropagation()} style={{ paddingTop: 2 }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(lead.id)}
                        aria-label={`Seleccionar lead de ${lead.email}`}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
                      />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, wordBreak: 'break-all', flex: 1, lineHeight: 1.4 }}>
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
                    {lead.mensaje.length > 100 ? lead.mensaje.slice(0, 100) + '…' : lead.mensaje}
                  </div>

                  {/* Tipo + temp + status */}
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <TipoBadge tipo={lead.tipo} />
                      <TemperatureBadge temperature={lead.temperature} score={lead.score} />
                    </div>
                    <StatusSelect lead={lead} isUpdating={isUpdating} isError={isError} onUpdate={updateStatus} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <BulkActionsBar
        count={selectedIds.size}
        isWorking={isBulkWorking}
        onChangeStatus={bulkUpdateStatus}
        onDelete={bulkDelete}
        onClear={clearSelection}
      />

      <LeadDetailDrawer
        lead={selectedLead}
        isGenerating={!!selectedLead && generatingId === selectedLead.id}
        isCopied={!!selectedLead && copiedId === selectedLead.id}
        isDeleting={!!selectedLead && deletingId === selectedLead.id}
        isUpdating={!!selectedLead && updatingId === selectedLead.id}
        isError={!!selectedLead && errorId === selectedLead.id}
        onClose={() => setSelectedId(null)}
        onGenerate={generateAi}
        onCopy={copyToClipboard}
        onDelete={deleteLead}
        onUpdateStatus={updateStatus}
      />
    </div>
  )
}
