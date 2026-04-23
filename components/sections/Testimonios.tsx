import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Card } from '@/components/ui/Card'

const CASES = [
  {
    init: 'S',
    name: 'Sofía M.',
    role: 'Academia de formación online',
    before: 'Tenía la idea en la cabeza desde hacía un año.',
    what: 'Lanzamos la plataforma de formación con registro de alumnos y pagos.',
    quote:
      'Llevaba meses hablando con agencias. Todas me decían 6 meses y presupuestos que no tenían. Con él, en tres semanas tenía la plataforma funcionando y a los primeros alumnos pagando.',
    after: 'Primeros ingresos en 3 semanas',
  },
  {
    init: 'C',
    name: 'Carlos R.',
    role: 'Reformas y construcción',
    before: 'Vivía de recomendaciones. Nada llegaba por internet.',
    what: 'Rehice la web enfocada en conseguir llamadas y solicitudes.',
    quote:
      'Mi web anterior era bonita pero no recibía ni una consulta. La rehizo enfocada en que la gente me llamara, y la diferencia fue el primer mes. Ya no dependo del boca a boca.',
    after: '+12 leads al mes desde la web',
  },
  {
    init: 'A',
    name: 'Ana L.',
    role: 'Marca de productos artesanales',
    before: 'Vendía por Instagram y no podía escalar.',
    what: 'Construimos la tienda online con catálogo, pagos y gestión de pedidos.',
    quote:
      'Lo que más valoro es que no me mareó con tecnicismos. Me explicó todo en cristiano, me dijo qué tenía sentido hacer y qué no, y entregó en plazo. Ahora tengo lista de espera.',
    after: 'Tienda online con lista de espera',
  },
] as const

export function Testimonios() {
  return (
    <section
      id="testimonios"
      style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <SectionLabel>Lo que dicen</SectionLabel>
          <h2
            className="font-head font-bold tracking-[-0.025em] leading-[1.15] mb-3"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
          >
            Proyectos reales. Resultados concretos.
          </h2>
          <p className="text-muted text-[16px] leading-[1.75]" style={{ maxWidth: 460 }}>
            Cada cliente llegó con un bloqueo distinto. Estos son los resultados
            reales, no frases de catálogo.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14 items-stretch">
          {CASES.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.1} className="h-full">
              <Card
                glow
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {/* Before + what we did */}
                <div className="mb-4">
                  <div
                    className="inline-block text-[11px] tracking-[0.06em] uppercase font-head font-semibold px-2.5 py-1 rounded"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--subtle)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    Situación
                  </div>
                  <p className="text-[13px] text-subtle italic mt-2 leading-[1.6]">
                    {c.before}
                  </p>
                  <p
                    className="text-[12px] font-head font-semibold mt-2 leading-[1.5]"
                    style={{ color: 'var(--accent)' }}
                  >
                    → {c.what}
                  </p>
                </div>

                {/* Quote — grows to fill */}
                <div className="flex-1">
                  <div
                    className="mb-3 leading-none opacity-70"
                    style={{
                      fontSize: 32,
                      color: 'var(--accent)',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    "
                  </div>
                  <p
                    className="text-[15px] leading-[1.8]"
                    style={{ color: 'rgba(240,241,245,0.85)' }}
                  >
                    {c.quote}
                  </p>
                </div>

                {/* After — result chip */}
                <div className="mt-5">
                  <div
                    className="inline-flex items-center gap-1.5 text-[12px] font-head font-semibold px-3 py-1.5 rounded-md"
                    style={{
                      background: 'rgba(79,124,255,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(79,124,255,0.25)',
                    }}
                  >
                    → {c.after}
                  </div>
                </div>

                {/* Author — always at bottom */}
                <div
                  className="flex gap-3 items-center mt-5 pt-5"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold font-head text-white flex-shrink-0"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent), var(--accent2))',
                    }}
                  >
                    {c.init}
                  </div>
                  <div>
                    <div className="font-head font-semibold text-[14px]">
                      {c.name}
                    </div>
                    <div className="text-[12px] text-muted">{c.role}</div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
