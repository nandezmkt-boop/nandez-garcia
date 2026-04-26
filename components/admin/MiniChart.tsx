interface BarData {
  label: string
  value: number
}

export function MiniChart({ data }: { data: BarData[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {data.map((bar, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            height: '100%',
          }}
        >
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div
              title={`${bar.value} lead${bar.value !== 1 ? 's' : ''}`}
              style={{
                width: '100%',
                height: `${Math.max((bar.value / max) * 100, bar.value > 0 ? 8 : 4)}%`,
                background:
                  bar.value > 0
                    ? 'linear-gradient(to top, rgba(79,124,255,0.5), rgba(79,124,255,1))'
                    : 'var(--bg3)',
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.4s ease',
                cursor: 'default',
                position: 'relative',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--subtle)',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}
          >
            {bar.label}
          </div>
        </div>
      ))}
    </div>
  )
}
