import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Card } from '@/components/ui/Card'

const ITEMS = [
  {
    n: '01',
    title: 'Tecnología y negocio en la misma persona',
    desc: 'La mayoría de desarrolladores no entienden de negocio, y los consultores de negocio no saben construir. Yo hago las dos cosas. Eso cambia lo que construyo y cómo lo construyo.',
    highlight: true,
  },
  {
    n: '02',
    title: 'Velocidad real gracias a la IA',
    desc: 'Uso inteligencia artificial para hacer en días lo que antes tardaba semanas. El juicio estratégico es mío. El tiempo de producción, no.',
    highlight: false,
  },
  {
    n: '03',
    title: 'Tu producto empieza a generar clientes desde el día 1',
    desc: 'No entrego código. Entrego un producto funcionando, con diseño, dominio, analytics y todo lo necesario para que empiece a trabajar para ti desde el primer día.',
    highlight: false,
  },
] as const

export function Solucion() {
  return (
    <section
      id="solucion"
      className="relative"
      style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '5%',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'rgba(79,124,255,0.05)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-[1200px] mx-auto relative">
        <FadeIn>
          <SectionLabel>Por qué funciona</SectionLabel>
          <h2
            className="font-head font-bold tracking-[-0.025em] leading-[1.15] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)', maxWidth: 540 }}
          >
            No soy más barato. Soy diferente por diseño.
          </h2>
          <p className="text-muted text-[16px] leading-[1.75]" style={{ maxWidth: 480 }}>
            Cualquiera puede construir una web. Lo difícil es construir algo que
            realmente haga crecer tu negocio.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14 items-stretch">
          {ITEMS.map((item, i) => (
            <FadeIn key={item.n} delay={i * 0.1} className="h-full">
              <Card glow style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
                <div className="flex gap-6 flex-1">
                  <div
                    className="font-head font-bold leading-none flex-shrink-0"
                    style={{ fontSize: 40, color: 'var(--border)', minWidth: 48 }}
                  >
                    {item.n}
                  </div>
                  <div className="flex flex-col justify-between">
                    <h3
                      className="font-head font-semibold text-[17px] mb-2.5 leading-[1.3]"
                      style={{ color: item.highlight ? 'var(--accent)' : 'var(--text)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-muted text-[14px] leading-[1.75]">
                      {item.desc}
                    </p>
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
