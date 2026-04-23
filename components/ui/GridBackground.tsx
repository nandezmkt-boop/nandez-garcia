export function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(39,42,58,0.25) 1px, transparent 1px),
          linear-gradient(90deg, rgba(39,42,58,0.25) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage:
          'radial-gradient(ellipse 80% 50% at 50% 0%, black 20%, transparent 75%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 50% at 50% 0%, black 20%, transparent 75%)',
      }}
    />
  )
}
