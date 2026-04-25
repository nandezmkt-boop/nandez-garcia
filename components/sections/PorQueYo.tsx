import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

const PILLARS = [
  {
    tag: 'Tecnología',
    benefit: 'No tienes que coordinar a varias personas',
    desc: 'Diseño, desarrollo y despliegue lo hago yo. Un solo interlocutor, sin depender de equipos externos ni de que alguien le explique al otro lo que necesitas.',
  },
  {
    tag: 'Marketing',
    benefit: 'Todo está pensado para que consigas clientes desde el principio',
    desc: 'No se construye primero y se piensa en marketing después. Cada decisión del producto está orientada a captar, convencer y convertir. Es la base, no un añadido.',
  },
  {
    tag: 'Negocio',
    benefit: 'No tienes que estar pendiente ni entender el proceso',
    desc: 'Yo me encargo de que funcione. Entiendo tus objetivos, tus plazos y tus limitaciones, y tomo decisiones que tienen sentido para tu negocio, no solo técnicamente.',
  },
] as const

const MULTIPLIERS = ['× velocidad', '× eficiencia', '× resultados'] as const

export function PorQueYo() {
  return (
    <section
      id="porqueyo"
      style={{
        padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)',
        borderTop: '1px solid rgba(39,42,58,0.5)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <FadeIn>
            <SectionLabel>Mi enfoque</SectionLabel>
            <h2
              className="font-head font-bold tracking-[-0.025em] leading-[1.15] mb-5"
              style={{ fontSize: 'clamp(28px,3.5vw,44px)' }}
            >
              Tres mundos en
              <br />
              la misma persona.
            </h2>
            <p className="text-muted text-[16px] leading-[1.8] mb-5" style={{ maxWidth: 420 }}>
              Tecnología, marketing y negocio en una sola persona.
              Potenciados por IA para ir más rápido.
            </p>
            <p className="text-muted text-[16px] leading-[1.8]" style={{ maxWidth: 420 }}>
              No tienes que entender cómo funciona nada de esto. Solo tienes
              que contarme qué quieres conseguir.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-4">
              {PILLARS.map((p) => (
                <div
                  key={p.tag}
                  className="px-[22px] py-5 rounded-xl"
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
                      style={{ boxShadow: '0 0 8px var(--accent)' }}
                    />
                    <span
                      className="text-[11px] font-head font-bold tracking-[0.08em] uppercase"
                      style={{ color: 'var(--accent)' }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <div className="font-head font-semibold text-[15px] mb-2 leading-[1.35]">
                    {p.benefit}
                  </div>
                  <div className="text-[14px] text-muted leading-[1.7]">
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* IA Aplicada — Multiplier Block */}
        <FadeIn delay={0.2}>
          <div
            className="relative overflow-hidden rounded-2xl mt-10"
            style={{
              background:
                'linear-gradient(135deg, rgba(79,124,255,0.06) 0%, rgba(155,92,255,0.04) 100%)',
              border: '1px solid rgba(79,124,255,0.28)',
              boxShadow: '0 0 48px rgba(79,124,255,0.07)',
              padding: 'clamp(22px,3vw,32px)',
            }}
          >
            {/* Subtle glow orb */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -50,
                right: -50,
                width: 240,
                height: 240,
                borderRadius: '50%',
                background: 'rgba(79,124,255,0.09)',
                filter: 'blur(70px)',
              }}
            />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              {/* Label + Copy */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: 'var(--accent)',
                      boxShadow: '0 0 10px var(--accent)',
                    }}
                  />
                  <span
                    className="text-[11px] font-head font-bold tracking-[0.08em] uppercase"
                    style={{ color: 'var(--accent)' }}
                  >
                    IA aplicada
                  </span>
                  <span
                    className="text-[10px] font-head font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(79,124,255,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(79,124,255,0.22)',
                    }}
                  >
                    Potenciador
                  </span>
                </div>

                <div className="font-head font-semibold text-[16px] mb-2.5 leading-[1.35]">
                  Recibes más en menos tiempo y a mejor precio
                </div>

                <p
                  className="text-[14px] text-muted leading-[1.7]"
                  style={{ maxWidth: 540 }}
                >
                  La IA no es un servicio más. Es lo que hace que todo vaya más
                  rápido, con más precisión y con menos coste.{' '}
                  <span style={{ color: 'rgba(240,241,245,0.7)' }}>
                    Lo que antes requería un equipo entero, ahora lo resuelvo yo
                    en días.
                  </span>
                </p>
              </div>

              {/* Multipliers */}
              <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                {MULTIPLIERS.map((m) => (
                  <div
                    key={m}
                    className="text-[13px] font-head font-bold px-3.5 py-2 rounded-lg text-center"
                    style={{
                      background: 'rgba(79,124,255,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(79,124,255,0.22)',
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
