import Image from 'next/image'

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--border)',
        padding: '36px clamp(16px,5vw,80px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          {/* Circular logo — small */}
          <div
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{
              width: 22,
              height: 22,
              background:
                'linear-gradient(135deg, rgba(79,124,255,0.2), rgba(155,92,255,0.15))',
              boxShadow: '0 0 8px rgba(79,124,255,0.18)',
            }}
          >
            <Image
              src="/logo.png"
              alt="HistopIAs"
              width={22}
              height={22}
              className="w-full h-full object-cover"
              style={{ opacity: 0.7 }}
            />
          </div>
          <span className="font-head font-semibold text-[14px] text-text">
            Nández García
          </span>
          <span className="text-[12px] text-subtle">· Tecnología + marketing + negocio</span>
        </div>
        <div className="text-[12px] text-subtle">
          © 2025 Nández García. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
