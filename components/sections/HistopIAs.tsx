import Image from 'next/image'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

export function HistopIAs() {
  return (
    <section
      id="histopias"
      className="relative overflow-hidden"
      style={{ padding: 'clamp(60px,10vw,120px) clamp(16px,5vw,80px)' }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 800, height: 800,
          borderRadius: '50%',
          background: 'rgba(155,92,255,0.04)',
          filter: 'blur(120px)',
        }}
      />

      <div className="max-w-[1200px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — brand + title */}
          <FadeIn>
            <SectionLabel>Mi enfoque</SectionLabel>

            {/* Logo + name */}
            <div className="flex items-center gap-4 mb-6 mt-4">
              <div
                className="rounded-full overflow-hidden flex-shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  background:
                    'linear-gradient(135deg, rgba(79,124,255,0.22), rgba(155,92,255,0.18))',
                  boxShadow:
                    '0 0 20px rgba(79,124,255,0.25), 0 0 0 1px rgba(79,124,255,0.16)',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="HistopIAs logo"
                  width={52}
                  height={52}
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.92 }}
                />
              </div>
              <span
                className="font-head font-bold tracking-[-0.03em]"
                style={{ fontSize: 'clamp(26px,3vw,34px)' }}
              >
                Histop
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent), var(--accent2))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  IAs
                </span>
              </span>
            </div>

            <h2
              className="font-head font-bold tracking-[-0.025em] leading-[1.2] mb-5"
              style={{ fontSize: 'clamp(22px,2.8vw,38px)' }}
            >
              De la idea al producto
              <br />
              que funciona de verdad.
            </h2>
          </FadeIn>

          {/* Right — narrative text */}
          <FadeIn delay={0.1}>
            <div
              className="text-[16px] leading-[1.85] space-y-5"
              style={{ color: 'rgba(240,241,245,0.72)' }}
            >
              <p>
                Hoy puedes construir casi cualquier cosa en internet.
                Lo que marca la diferencia ya no es la tecnología:{' '}
                <span style={{ color: 'rgba(240,241,245,0.9)' }}>
                  es tener claro qué construir y hacer que funcione.
                </span>
              </p>
              <p>
                La mayoría de proyectos fallan ahí. Tienen la idea, pero no saben
                convertirla en algo real que genere resultados.{' '}
                <span style={{ color: 'rgba(240,241,245,0.88)' }}>
                  Ahí es donde entro yo.
                </span>
              </p>
              <div
                className="pl-4 py-1.5 text-[15px] leading-[2]"
                style={{
                  borderLeft: '2px solid rgba(79,124,255,0.4)',
                  color: 'rgba(240,241,245,0.6)',
                }}
              >
                Qué vendes. A quién. Por qué te eligen.
                <br />
                Y cómo ocurre eso online.
              </div>
              <p>
                A partir de ahí, construyo lo mínimo necesario para que funcione.
                Sin equipos enormes, sin meses de espera, sin complicaciones.
              </p>
              <p
                className="font-head font-semibold text-[17px]"
                style={{ color: 'rgba(240,241,245,0.95)' }}
              >
                Mi trabajo es hacer que tu idea se convierta en algo real que funcione.
              </p>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
