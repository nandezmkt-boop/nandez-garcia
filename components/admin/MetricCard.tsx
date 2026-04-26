interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  accent?: boolean
  trend?: { value: number; label: string }
}

export function MetricCard({ title, value, subtitle, accent, trend }: MetricCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg2)',
        border: `1px solid ${accent ? 'rgba(79,124,255,0.35)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '20px 22px',
        boxShadow: accent ? '0 0 20px rgba(79,124,255,0.08)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {accent && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          }}
        />
      )}
      <div
        style={{
          fontSize: 11,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: accent ? 'var(--accent)' : 'var(--text)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      {(subtitle || trend) && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          {subtitle && (
            <span style={{ fontSize: 12, color: 'var(--subtle)' }}>{subtitle}</span>
          )}
          {trend && (
            <span
              style={{
                fontSize: 11,
                color: trend.value >= 0 ? '#10b981' : '#ef4444',
                background: trend.value >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                padding: '2px 6px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)} {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
