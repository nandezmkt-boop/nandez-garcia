'use client'

import Image from 'next/image'
import { FadeIn } from '@/components/ui/FadeIn'

const METRICS = [
  { value: '7 días', label: 'Hasta los primeros leads o usuarios' },
  { value: '+12 lanzados', label: 'Proyectos online y funcionando' },
  { value: '<24h', label: 'Respuesta a tu mensaje' },
] as const

const AVATARS = ['S', 'C', 'A'] as const

export function Hero({ showUrgency = true }: { showUrgency?: boolean }) {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{
        minHeight: '100vh',
        padding:
          'clamp(88px,10vw,120px) clamp(16px,5vw,80px) clamp(60px,10vw,120px)',
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', right: '-5%',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'rgba(79,124,255,0.07)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '15%',
          width: 350, height: 350,
          borderRadius: '50%',
          background: 'rgba(155,92,255,0.05)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-20 lg:items-center">
        <div className="flex-1 min-w-0">
          <FadeIn>
            {showUrgency && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
                style={{
                  border: '1px solid rgba(79,124,255,0.3)',
                  background: 'rgba(79,124,255,0.08)',
                  maxWidth: '100%',
                }}
              >
                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-accent block flex-shrink-0" />
                <span className="text-[12px] sm:text-[13px] text-accent font-head font-medium">
                  Disponible este mes · Respondo en menos de 24h
                </span>
              </div>
            )}

            <p
              className="font-head font-semibold leading-[1.35] mb-4"
              style={{
                fontSize: 'clamp(18px,2.2vw,26px)',
                color: 'rgba(240,241,245,0.55)',
              }}
            >
              Tu web puede verse bien…
              <br />
              y no estar trayendo ni un cliente.
            </p>

            <h1
              className="font-head font-bold tracking-[-0.03em] leading-[1.08] mb-5"
              style={{ fontSize: 'clamp(28px,4.5vw,60px)' }}
            >
              Convierto ideas y tráfico en{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent) 30%, var(--accent2))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                negocio.
              </span>
              <br />
              En semanas, no en meses.
            </h1>

            <p
              className="text-muted leading-[1.75] mb-8 sm:mb-10 text-[16px] sm:text-[18px]"
              style={{ maxWidth: 560 }}
            >
              Si ya tienes un negocio, te construyo la página que capta clientes.
              <br />
              Si tienes una idea, la convierto en un producto que la gente puede usar.
              <br />
              Tecnología, marketing y negocio en la misma persona.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 mb-10 sm:mb-12">
              <a
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 font-head font-semibold text-[15px] tracking-tight px-7 py-[14px] rounded-lg text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--accent)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = '#6690ff'
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    '0 10px 32px rgba(79,124,255,0.45)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)'
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                }}
              >
                Cuéntame tu caso →
              </a>
              <a
                href="#testimonios"
                className="inline-flex items-center justify-center gap-2 font-head font-semibold text-[15px] tracking-tight px-7 py-[14px] rounded-lg no-underline transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent)'
                  ;(e.currentTarget as HTMLAnchorElement).style.background =
                    'rgba(79,124,255,0.06)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                }}
              >
                Ver casos reales →
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {METRICS.map(({ value, label }) => (
                <div key={value}>
                  <div className="font-head font-bold text-[20px] sm:text-[22px] text-text">
                    {value}
                  </div>
                  <div className="text-[12px] text-muted mt-0.5" style={{ maxWidth: 140 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="w-full max-w-[320px] mx-auto lg:mx-0 lg:flex-shrink-0 lg:w-[300px]">
          <FounderCard />
        </FadeIn>
      </div>
    </section>
  )
}

function FounderCard() {
  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 20,
          border: '1px solid var(--border)',
          background: 'var(--bg2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(39,42,58,0.4)',
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: -40, right: -40,
            width: 160, height: 160,
            borderRadius: '50%',
            background: 'rgba(79,124,255,0.1)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative overflow-hidden">
          <Image
            src="/founder.png"
            alt="Nández García — Desarrollador de productos digitales"
            width={300}
            height={300}
            priority
            className="w-full object-cover block"
            style={{ aspectRatio: '1/1', filter: 'contrast(1.05)' }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(transparent, var(--bg2))' }}
          />
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="font-head font-bold text-[18px] tracking-tight leading-tight">
            Nández García
          </div>
          <div
            className="text-[11px] tracking-[0.04em] mt-0.5 mb-1"
            style={{ color: 'var(--subtle)' }}
          >
            José Ignacio Hernández García
          </div>
          <div className="text-[13px] text-muted mt-2 mb-4">
            Ingeniero · Especialista en marketing · IA aplicada
          </div>
          <div
            className="text-[13px] leading-[1.7] italic"
            style={{
              padding: '14px 16px',
              background: 'var(--bg3)',
              borderRadius: 10,
              border: '1px solid var(--border)',
              color: 'rgba(240,241,245,0.72)',
            }}
          >
            "No hago webs.
            Construyo sistemas que generan clientes."
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5 justify-center">
        <div className="flex">
          {AVATARS.map((letter, i) => (
            <div
              key={letter}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-muted"
              style={{
                background: `hsl(${250 + i * 15}, 20%, 20%)`,
                borderColor: 'var(--bg)',
                marginLeft: i > 0 ? -6 : 0,
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <span className="text-[12px] text-muted">+12 proyectos lanzados</span>
      </div>
    </div>
  )
}
