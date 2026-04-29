'use client'
import { useEffect, useState } from 'react'

export type Temperature = 'cold' | 'warm' | 'hot'

export const TEMPERATURE_CONFIG: Record<Temperature, { label: string; color: string; bg: string; border: string }> = {
  hot:  { label: '🔥 Hot',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'  },
  warm: { label: '🌡 Warm', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  cold: { label: '❄ Cold', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)' },
}

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
  score: number
  temperature: Temperature
}

export type Status = 'new' | 'contacted' | 'closed'

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  new:       { label: 'Nuevo',       color: '#4f7cff', bg: 'rgba(79,124,255,0.12)' },
  contacted: { label: 'Contactado',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  closed:    { label: 'Cerrado',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
}

export const TIPO_LABELS: Record<string, string> = {
  negocio:    'Negocio',
  idea:       'Idea',
  'no-claro': 'Sin definir',
}

export function StatusSelect({
  lead,
  isUpdating,
  isError,
  onUpdate,
  size = 'sm',
}: {
  lead: LeadRow
  isUpdating: boolean
  isError: boolean
  onUpdate: (id: string, status: Status) => void
  size?: 'sm' | 'md'
}) {
  const [localValue, setLocalValue] = useState<Status>(lead.status as Status)

  useEffect(() => { setLocalValue(lead.status as Status) }, [lead.status])

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation()
    const newStatus = e.target.value as Status
    setLocalValue(newStatus)
    onUpdate(lead.id, newStatus)
  }

  const cfg = STATUS_CONFIG[localValue] ?? STATUS_CONFIG.new
  const sizing = size === 'md'
    ? { fontSize: 12, padding: '6px 10px', radius: 7 }
    : { fontSize: 11, padding: '4px 8px', radius: 6 }

  return (
    <select
      value={localValue}
      onChange={handleChange}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      disabled={isUpdating}
      title={isError ? 'Error al actualizar — revisa la consola' : undefined}
      style={{
        fontSize: sizing.fontSize,
        padding: sizing.padding,
        borderRadius: sizing.radius,
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

export function TipoBadge({ tipo }: { tipo: string | null }) {
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

export function TemperatureBadge({ temperature, score }: { temperature: Temperature; score: number }) {
  const cfg = TEMPERATURE_CONFIG[temperature] ?? TEMPERATURE_CONFIG.cold
  return (
    <span
      title={`Score: ${score}/100`}
      style={{
        fontSize: 11,
        padding: '3px 8px',
        borderRadius: 5,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: 'default',
      }}
    >
      {cfg.label}
    </span>
  )
}

export function ScorePill({ score }: { score: number }) {
  const color = score >= 71 ? '#ef4444' : score >= 31 ? '#f59e0b' : '#64748b'
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        minWidth: 28,
        textAlign: 'right' as const,
        display: 'inline-block',
      }}
    >
      {score}
    </span>
  )
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const min = Math.floor(diff / 60_000)
  if (min < 1)    return 'ahora mismo'
  if (min < 60)   return `hace ${min} min`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7)   return `hace ${days}d`
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}
