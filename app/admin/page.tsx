import { prisma } from '@/lib/prisma'
import { MetricCard } from '@/components/admin/MetricCard'
import { MiniChart } from '@/components/admin/MiniChart'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const now = new Date()

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - 6)
  weekStart.setHours(0, 0, 0, 0)

  const prevWeekStart = new Date(weekStart)
  prevWeekStart.setDate(prevWeekStart.getDate() - 7)

  // Single query, compute everything in JS
  const allLeads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const total       = allLeads.length
  const todayCount  = allLeads.filter(l => l.createdAt >= todayStart).length
  const weekCount   = allLeads.filter(l => l.createdAt >= weekStart).length
  const prevWeekCount = allLeads.filter(
    l => l.createdAt >= prevWeekStart && l.createdAt < weekStart
  ).length
  const closedCount = allLeads.filter(l => l.status === 'closed').length
  const conversion  = total > 0 ? Math.round((closedCount / total) * 100) : 0
  const recentLeads = allLeads.slice(0, 6)

  // Chart: leads per day for last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(weekStart)
    dayStart.setDate(dayStart.getDate() + i)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)
    return {
      label: dayStart.toLocaleDateString('es-ES', { weekday: 'short' }),
      value: allLeads.filter(l => l.createdAt >= dayStart && l.createdAt < dayEnd).length,
    }
  })

  // Tipo breakdown
  const tipoData = ['negocio', 'idea', 'no-claro'].map(tipo => ({
    tipo,
    count: allLeads.filter(l => l.tipo === tipo).length,
  }))

  // Status breakdown
  const statusData = [
    { label: 'Nuevos',      key: 'new',       color: '#4f7cff' },
    { label: 'Contactados', key: 'contacted', color: '#f59e0b' },
    { label: 'Cerrados',    key: 'closed',    color: '#10b981' },
  ].map(s => ({ ...s, count: allLeads.filter(l => l.status === s.key).length }))

  const weekTrend = prevWeekCount > 0
    ? weekCount - prevWeekCount
    : 0

  const TIPO_LABELS: Record<string, string> = {
    negocio: 'Negocio',
    idea: 'Idea',
    'no-claro': 'Sin definir',
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
          Overview
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 5 }}>
          {now.toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 28,
        }}
      >
        <MetricCard title="Total leads" value={total} subtitle={total === 0 ? 'Aún sin leads' : undefined} />
        <MetricCard
          title="Leads hoy"
          value={todayCount}
          accent
          subtitle={todayCount === 0 ? 'Ninguno por ahora' : 'en las últimas 24h'}
        />
        <MetricCard
          title="Esta semana"
          value={weekCount}
          trend={weekTrend !== 0 ? { value: weekTrend, label: 'vs semana anterior' } : undefined}
        />
        <MetricCard
          title="Conversión"
          value={`${conversion}%`}
          subtitle={`${closedCount} cerrado${closedCount !== 1 ? 's' : ''} de ${total}`}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, marginBottom: 28 }}>
        {/* Bar chart */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              Actividad — últimos 7 días
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{weekCount} leads</div>
          </div>
          <MiniChart data={chartData} />
        </div>

        {/* Status breakdown */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 22px',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>
            Por estado
          </div>
          {statusData.map(({ label, count, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {label}
                </span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{count}</span>
              </div>
              <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2 }}>
                <div
                  style={{
                    height: '100%',
                    width: total > 0 ? `${(count / total) * 100}%` : '0%',
                    background: color,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
        {/* Recent activity */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              Actividad reciente
            </div>
            <a
              href="/admin/leads"
              style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
            >
              Ver todos →
            </a>
          </div>

          {recentLeads.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              Aún no hay leads. El formulario está listo.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentLeads.map((lead, i) => (
                <div
                  key={lead.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < recentLeads.length - 1 ? '1px solid var(--border)' : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(79,124,255,0.2), rgba(155,92,255,0.15))',
                      border: '1px solid rgba(79,124,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    {lead.email[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, marginBottom: 2 }}>
                      {lead.email}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      } as React.CSSProperties}
                    >
                      {lead.mensaje}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--subtle)', flexShrink: 0 }}>
                    {lead.createdAt.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tipo breakdown */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 22px',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>
            Por tipo de proyecto
          </div>
          {tipoData.map(({ tipo, count }) => (
            <div key={tipo} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'var(--muted)' }}>{TIPO_LABELS[tipo]}</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{count}</span>
              </div>
              <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2 }}>
                <div
                  style={{
                    height: '100%',
                    width: total > 0 ? `${(count / total) * 100}%` : '0%',
                    background: 'var(--accent2)',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ))}

          {total === 0 && (
            <div style={{ fontSize: 12, color: 'var(--subtle)', textAlign: 'center', paddingTop: 8 }}>
              Sin datos aún
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
