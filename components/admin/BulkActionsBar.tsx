'use client'
import { type Status, STATUS_CONFIG } from './leads-shared'

export function BulkActionsBar({
  count,
  isWorking,
  onChangeStatus,
  onDelete,
  onClear,
}: {
  count: number
  isWorking: boolean
  onChangeStatus: (status: Status) => void
  onDelete: () => void
  onClear: () => void
}) {
  if (count === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8000,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        animation: 'admin-bulk-in 0.2s ease-out',
        maxWidth: 'calc(100vw - 32px)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: 'var(--text)',
          fontWeight: 600,
          padding: '0 4px',
        }}
      >
        {count} seleccionado{count !== 1 ? 's' : ''}
      </div>

      <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

      <select
        defaultValue=""
        disabled={isWorking}
        onChange={e => {
          const v = e.target.value as Status | ''
          if (v) {
            onChangeStatus(v)
            e.target.value = ''
          }
        }}
        style={{
          padding: '6px 10px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 7,
          color: 'var(--text)',
          fontSize: 12,
          outline: 'none',
          cursor: isWorking ? 'wait' : 'pointer',
          opacity: isWorking ? 0.6 : 1,
          fontWeight: 500,
        }}
      >
        <option value="" disabled>Cambiar estado…</option>
        {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
        ))}
      </select>

      <button
        onClick={onDelete}
        disabled={isWorking}
        style={{
          padding: '6px 12px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 7,
          color: '#ef4444',
          fontSize: 12,
          fontWeight: 600,
          cursor: isWorking ? 'wait' : 'pointer',
          opacity: isWorking ? 0.6 : 1,
        }}
      >
        Eliminar
      </button>

      <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

      <button
        onClick={onClear}
        disabled={isWorking}
        aria-label="Limpiar selección"
        title="Limpiar (Esc)"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          fontSize: 18,
          cursor: 'pointer',
          padding: '2px 6px',
          lineHeight: 1,
          borderRadius: 6,
        }}
      >
        ×
      </button>

      <style>{`
        @keyframes admin-bulk-in {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}
