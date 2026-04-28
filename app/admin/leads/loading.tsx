export default function LeadsLoading() {
  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Shimmer width={120} height={26} />
        <div style={{ height: 8 }} />
        <Shimmer width={140} height={14} />
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {[0, 1, 2].map(i => (
          <Shimmer key={i} width={120} height={32} radius={8} />
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <Shimmer width={240} height={36} radius={8} />
        <Shimmer width={150} height={36} radius={8} />
        <Shimmer width={150} height={36} radius={8} />
        <Shimmer width={90}  height={36} radius={8} />
        <Shimmer width={120} height={36} radius={8} />
      </div>

      {/* Rows */}
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 16,
              padding: '16px 16px',
              borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
              alignItems: 'center',
            }}
          >
            <Shimmer width={180} height={14} />
            <div style={{ flex: 1 }}>
              <Shimmer width="80%" height={12} />
            </div>
            <Shimmer width={70}  height={20} radius={5} />
            <Shimmer width={100} height={24} radius={6} />
            <Shimmer width={70}  height={14} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes admin-shimmer {
          0%   { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
      `}</style>
    </div>
  )
}

function Shimmer({
  width,
  height,
  radius = 4,
}: {
  width: number | string
  height: number
  radius?: number
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, var(--bg2) 0%, var(--bg3) 50%, var(--bg2) 100%)',
        backgroundSize: '600px 100%',
        animation: 'admin-shimmer 1.4s infinite linear',
      }}
    />
  )
}
