import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  ['Servicios', '/#servicios'],
  ['Cómo trabajo', '/#proceso'],
  ['Casos', '/#testimonios'],
  ['Contacto', '/contacto'],
] as const

const LEGAL_LINKS = [
  ['Aviso legal', '/legal/aviso-legal'],
  ['Política de privacidad', '/legal/privacidad'],
  ['Cookies', '/legal/cookies'],
] as const

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--border)',
        padding: 'clamp(40px,6vw,64px) clamp(16px,5vw,80px) 28px',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="rounded-full overflow-hidden flex-shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  background:
                    'linear-gradient(135deg, rgba(79,124,255,0.2), rgba(155,92,255,0.15))',
                  boxShadow: '0 0 8px rgba(79,124,255,0.18)',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="HistopIAs"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.7 }}
                />
              </div>
              <span className="font-head font-semibold text-[14px] text-text">
                Nández García
              </span>
            </div>
            <p className="text-[13px] text-muted leading-[1.7]" style={{ maxWidth: 280 }}>
              Tecnología, marketing y negocio en la misma persona.
            </p>
            <a
              href="mailto:hola@nandezgarcia.com"
              className="text-[13px] no-underline transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              hola@nandezgarcia.com
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="text-[11px] tracking-[0.08em] uppercase font-head font-semibold"
              style={{ color: 'var(--subtle)' }}
            >
              Navegación
            </div>
            {NAV_LINKS.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[13px] text-muted no-underline transition-colors hover:text-text"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="text-[11px] tracking-[0.08em] uppercase font-head font-semibold"
              style={{ color: 'var(--subtle)' }}
            >
              Legal
            </div>
            {LEGAL_LINKS.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[13px] text-muted no-underline transition-colors hover:text-text"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="text-[12px] text-subtle">
            © {new Date().getFullYear()} Nández García · HistopIAs
          </div>
          <div className="text-[12px] text-subtle">
            Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
