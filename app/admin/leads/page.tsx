import { prisma } from '@/lib/prisma'
import { LeadsTable, type LeadRow } from '@/components/admin/LeadsTable'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const raw = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Serialize dates before passing to client component
  const leads: LeadRow[] = raw.map(l => ({
    id: l.id,
    email: l.email,
    mensaje: l.mensaje,
    tipo: l.tipo,
    status: l.status,
    source: l.source,
    createdAt: l.createdAt.toISOString(),
    aiResponse: l.aiResponse,
    aiResponseAt: l.aiResponseAt ? l.aiResponseAt.toISOString() : null,
    aiError: l.aiError,
    score: l.score,
    temperature: l.temperature as LeadRow['temperature'],
  }))

  const newCount       = leads.filter(l => l.status === 'new').length
  const contactedCount = leads.filter(l => l.status === 'contacted').length
  const closedCount    = leads.filter(l => l.status === 'closed').length

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Leads
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 5 }}>
          {leads.length} lead{leads.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Nuevos',      count: newCount,       color: '#4f7cff' },
          { label: 'Contactados', count: contactedCount, color: '#f59e0b' },
          { label: 'Cerrados',    count: closedCount,    color: '#10b981' },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                display: 'inline-block',
              }}
            />
            <span style={{ color: 'var(--muted)' }}>{label}</span>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{count}</span>
          </div>
        ))}
      </div>

      <LeadsTable initialLeads={leads} />
    </div>
  )
}
