import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Card } from '@/components/ui/Card'

const ITEMS = [
  {
    title: 'Construcción sin negocio',
    desc: 'Se construye algo técnicamente correcto, pero no pensado para atraer clientes. Existe, pero no trabaja para nadie.',
  },
  {
    title: 'Marketing sin ejecución',
    desc: 'Se sabe qué decir y cómo vender, pero depende de otros para construirlo. Ahí es donde se pierde tiempo, dinero y dirección.',
  },
  {
    title: 'Lo que acaba pasando',
    desc: 'Proyectos que se quedan a medio camino. Webs que no convierten. Ideas que nunca llegan a lanzarse.',
  },
] as const

export function Problema() {
  return (
    <section
      style={{
        padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)',
        borderTop: '1px solid rgba(39,42,58,0.5)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <SectionLabel>El problema real</SectionLabel>
          <h2
            className="font-head font-bold tracking-[-0.025em] leading-[1.15] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)', maxWidth: 560 }}
          >
            No es que lo hagan mal.
            <br />
            Es que falta una pieza.
          </h2>
          <p
            className="text-muted text-[16px] leading-[1.75]"
            style={{ maxWidth: 520 }}
          >
            La mayoría de proyectos digitales no fallan por culpa de una sola
            persona. Fallan porque cada perfil domina solo una parte del proceso.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <Card
                glow
                style={{ borderLeft: '3px solid rgba(79,124,255,0.3)', paddingLeft: 24 }}
              >
                <h3 className="font-head font-semibold text-[17px] mb-3 leading-[1.3]">
                  {item.title}
                </h3>
                <p className="text-muted text-[14px] leading-[1.75]">
                  {item.desc}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Closing bridge — hybrid profile as logical solution */}
        <FadeIn delay={0.35}>
          <div
            className="mt-10 px-6 py-7 md:px-8 rounded-2xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(79,124,255,0.08), rgba(155,92,255,0.08))',
              border: '1px solid rgba(79,124,255,0.25)',
            }}
          >
            <p
              className="font-head font-semibold text-[17px] md:text-[19px] leading-[1.6]"
              style={{ color: 'rgba(240,241,245,0.95)', maxWidth: 680 }}
            >
              La solución no es elegir mejor a quién contratar.
              <br />
              Es trabajar con alguien que entienda todo el proceso.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
