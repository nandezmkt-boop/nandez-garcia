import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

const STEPS = [
  {
    n: '01',
    label: 'Entiendo tu negocio',
    desc: 'Una llamada de 30 minutos donde me cuentas qué haces, a quién vendes y qué bloqueo tienes ahora mismo.',
    outcome: 'Sales con claridad sobre qué hacer y qué no',
  },
  {
    n: '02',
    label: 'Definimos qué construir',
    desc: 'Te mando una propuesta concreta: qué hago, cómo lo hago, cuánto cuesta y en qué plazo. Sin letra pequeña.',
    outcome: 'Sabes exactamente qué vas a recibir y en cuánto tiempo',
  },
  {
    n: '03',
    label: 'Lo construyo',
    desc: 'Yo trabajo, tú sigues con lo tuyo. Te enseño avances cada pocos días para que puedas opinar sin meetings eternos.',
    outcome: 'Empiezas a ver algo real',
  },
  {
    n: '04',
    label: 'Lo lanzamos',
    desc: 'Tu web o producto online, con dominio, analítica y todo listo. Y si algo se rompe después, respondo.',
    outcome: 'Lo tienes funcionando y mejorando',
  },
] as const

export function Proceso() {
  return (
    <section
      id="proceso"
      style={{
        padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)',
        borderTop: '1px solid rgba(39,42,58,0.5)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <SectionLabel>Cómo trabajo</SectionLabel>
          <h2
            className="font-head font-bold tracking-[-0.025em] leading-[1.15] mb-3"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)', maxWidth: 560 }}
          >
            Cuatro pasos simples. Tú siempre sabes en qué punto estamos.
          </h2>
          <p className="text-muted text-[16px] leading-[1.75]" style={{ maxWidth: 460 }}>
            Sin reuniones innecesarias ni jerga técnica. Solo avance real cada semana.
          </p>
        </FadeIn>

        <div className="relative mt-[72px]">
          {/* Connector line — only visible on large screens where 4 cols are in a row */}
          <div
            className="absolute pointer-events-none hidden lg:block"
            style={{
              top: 28,
              left: 28,
              right: 28,
              height: 1,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              opacity: 0.2,
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.12}>
                <div>
                  <div
                    className="font-head font-bold text-[14px] text-white flex items-center justify-center relative z-10 mb-5"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background:
                        'linear-gradient(135deg, var(--accent), var(--accent2))',
                      boxShadow: '0 8px 24px rgba(79,124,255,0.3)',
                    }}
                  >
                    {step.n}
                  </div>
                  <h3 className="font-head font-semibold text-[17px] mb-2.5">
                    {step.label}
                  </h3>
                  <p className="text-muted text-[14px] leading-[1.75] mb-3">
                    {step.desc}
                  </p>
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-head font-semibold"
                    style={{
                      background: 'rgba(79,124,255,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(79,124,255,0.2)',
                    }}
                  >
                    → {step.outcome}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
