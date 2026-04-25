'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const NAV_LINKS = [
  ['Servicios', '/#servicios'],
  ['Cómo funciona', '/#proceso'],
  ['Mi enfoque', '/#histopias'],
  ['Clientes', '/#testimonios'],
] as const

/* ─── Circular logo wrapper (reutilizable) ─────────────────────────── */
export function LogoBadge({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        background:
          'linear-gradient(135deg, rgba(79,124,255,0.22), rgba(155,92,255,0.18))',
        boxShadow:
          '0 0 14px rgba(79,124,255,0.22), 0 0 0 1px rgba(79,124,255,0.14)',
      }}
    >
      <Image
        src="/logo.png"
        alt="HistopIAs"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        style={{ opacity: 0.92 }}
      />
    </div>
  )
}

/* ─── Navbar ────────────────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      if (window.scrollY > 50) setMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || menuOpen ? 'rgba(13,14,20,0.94)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(18px)' : 'none',
        borderBottom:
          scrolled || menuOpen
            ? '1px solid rgba(39,42,58,0.5)'
            : '1px solid transparent',
        padding: '0 clamp(16px,5vw,80px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16">
        {/* Brand */}
        <a href="/" onClick={closeMenu} className="flex items-center gap-2.5 no-underline">
          <LogoBadge size={30} />
          <div>
            <span className="font-head font-bold text-[15px] tracking-tight text-text">
              Nández García
            </span>
            <span className="text-[11px] text-subtle ml-1.5 font-body hidden sm:inline">
              · Productos digitales que funcionan
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[14px] text-muted hover:text-text transition-colors duration-200 no-underline"
            >
              {label}
            </a>
          ))}
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-lg font-head font-semibold text-[13px] text-white transition-all duration-200 no-underline"
            style={{ background: 'var(--accent)' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background = '#6690ff'
              ;(e.currentTarget as HTMLAnchorElement).style.boxShadow =
                '0 0 24px rgba(79,124,255,0.4)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)'
              ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
            }}
          >
            Hablemos →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-[2px] bg-text rounded transition-all duration-200"
            style={{
              width: 20,
              transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }}
          />
          <span
            className="block h-[2px] bg-text rounded transition-all duration-200"
            style={{ width: 20, opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-[2px] bg-text rounded transition-all duration-200"
            style={{
              width: 20,
              transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? 400 : 0 }}
      >
        <div className="flex flex-col" style={{ padding: '0 clamp(16px,5vw,80px)' }}>
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={closeMenu}
              className="text-[15px] text-muted py-4 no-underline transition-colors hover:text-text"
              style={{ borderBottom: '1px solid rgba(39,42,58,0.4)' }}
            >
              {label}
            </a>
          ))}
          <div className="py-4">
            <a
              href="/contacto"
              onClick={closeMenu}
              className="flex items-center justify-center w-full font-head font-semibold text-[15px] px-7 py-[14px] rounded-lg text-white no-underline"
              style={{ background: 'var(--accent)' }}
            >
              Hablemos →
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
