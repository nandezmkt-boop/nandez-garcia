'use client'
import { useState } from 'react'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

const SERVICES = [
  {
    id: 0,
    tipo: 'negocio',
    tag: 'Ya tienes un negocio',
    forWho: 'Para negocios que ya existen y necesitan clientes',
    price: 'Desde 490€',
    badge: null,
    headline: 'Una página que convierte visitas en clientes.',
    desc: 'No necesitas una web bonita. Necesitas una web que haga que la gente te escriba, te llame o te compre. Eso es lo que construyo.',
    features: [
      'Mensaje claro que se entiende en 5 segundos',
      'Diseño pensado para que la gente actúe, no para impresionar',
      'Formulario de contacto que realmente captura leads',
      'Analítica configurada para saber qué funciona',
      'Online en menos de una semana',
    ],
    color: '#4f7cff',
    glowRgb: '79,124,255',
    result: 'Resultado: empiezas a recibir contactos reales en días, no en meses.',
  },
  {
    id: 1,
    tipo: 'idea',
    tag: 'Tienes una idea',
    forWho: 'Para personas con una idea que quieren lanzarla',
    price: 'Desde 1.490€',
    badge: 'MÁS ELEGIDO',
    headline: 'Tu idea convertida en producto real.',
    desc: 'No te doy un diseño. Te doy algo que la gente puede usar de verdad. Puede ser una app, una web o una herramienta interna para tu negocio que puedas enseñar, usar o empezar a vender.',
    features: [
      'Traduzco tu idea en un plan claro en 48 horas',
      'Desarrollo completo de la primera versión funcional',
      'Usuarios, base de datos y panel para gestionarlo todo',
      'Diseño simple y usable, sin complicaciones',
      'En manos de usuarios reales en 2–3 semanas',
    ],
    color: '#9b5cff',
    glowRgb: '155,92,255',
    result: 'Resultado: dejas de hablar de tu idea y empiezas a enseñarla funcionando.',
  },
] as const

export function Servicios() {
  return (
    <section
      id="servicios"
      style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <SectionLabel>Qué puedo hacer por ti</SectionLabel>
          <h2
            className="font-head font-bold tracking-[-0.025em] leading-[1.15] mb-3"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
          >
            Dos formas de trabajar juntos.
          </h2>
          <p className="text-muted text-[16px] leading-[1.75]" style={{ maxWidth: 520 }}>
            Elige según tu momento. Si ya tienes un negocio, trabajamos en conseguir
            clientes. Si tienes una idea, la convertimos en algo real que la gente
            pueda usar.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 items-stretch">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.1} className="h-full">
              <ServiceCard service={s} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className="mt-10 text-center text-[13px] text-muted" style={{ maxWidth: 560, margin: '40px auto 0' }}>
            ¿No sabes cuál es el tuyo? Escríbeme. En la primera llamada te lo digo
            claro, o te digo honestamente si no encaja.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
}: {
  service: (typeof SERVICES)[number]
}) {
  const [hovered, setHovered] = useState(false)
  const on = hovered

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative transition-all duration-[250ms] flex flex-col h-full"
      style={{
        borderRadius: 18,
        border: `1px solid ${on ? `${service.color}80` : 'var(--border)'}`,
        background: on ? `rgba(${service.glowRgb},0.08)` : 'var(--bg2)',
        padding: 32,
        transform: service.badge && on ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: on ? `0 20px 50px rgba(${service.glowRgb},0.14)` : 'none',
      }}
    >
      {service.badge && (
        <div
          className="absolute font-head font-bold text-[11px] tracking-[0.06em] px-3.5 py-1 rounded-full text-white whitespace-nowrap"
          style={{
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: service.color,
          }}
        >
          {service.badge}
        </div>
      )}

      <div className="flex flex-col flex-1">
        <div
          className="text-[11px] font-head font-semibold mb-1.5 tracking-[0.08em] uppercase"
          style={{ color: service.color }}
        >
          {service.tag}
        </div>

        <div className="font-head font-bold text-[22px] tracking-[-0.02em] mb-3 leading-[1.25]">
          {service.headline}
        </div>

        <div className="text-muted text-[15px] leading-[1.75] mb-6">
          {service.desc}
        </div>

        <div
          className="text-[13px] leading-[1.6] mb-6 px-4 py-3 rounded-lg font-medium"
          style={{ background: 'var(--bg3)', color: service.color }}
        >
          {service.result}
        </div>

        <div className="border-t pt-5 flex-1" style={{ borderColor: 'var(--border)' }}>
          <div className="text-[11px] text-subtle tracking-[0.08em] uppercase font-head font-semibold mb-3">
            Qué incluye
          </div>
          {service.features.map((f) => (
            <div key={f} className="flex gap-2.5 items-start mb-2.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5 flex-shrink-0"
              >
                <circle cx="8" cy="8" r="7" stroke={service.color} strokeWidth="1.5" />
                <path
                  d="M5 8l2 2 4-4"
                  stroke={service.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[14px] text-muted leading-[1.5]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-5 mt-5"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="font-head font-bold text-[20px]">{service.price}</span>
        <a
          href={`/contacto?tipo=${service.tipo}`}
          className="inline-flex items-center gap-1 text-[14px] font-head font-semibold no-underline transition-transform duration-200 hover:translate-x-0.5"
          style={{ color: service.color }}
        >
          Empezar aquí →
        </a>
      </div>
    </div>
  )
}
