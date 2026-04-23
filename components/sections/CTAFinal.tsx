'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/schema'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

function SubmitButton({ sending }: { sending: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="submit"
      disabled={sending}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full inline-flex items-center justify-center gap-2 font-head font-semibold text-[15px] tracking-tight rounded-lg px-7 py-[14px] text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: hovered && !sending ? '#6690ff' : 'var(--accent)',
        boxShadow: hovered && !sending ? '0 0 32px rgba(79,124,255,0.45)' : 'none',
      }}
    >
      {sending ? 'Enviando...' : 'Enviar y recibir respuesta en 24h →'}
    </button>
  )
}

export function CTAFinal({ showUrgency = true }: { showUrgency?: boolean }) {
  const [status, setStatus] = useState<FormStatus>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contacto"
      className="relative"
      style={{
        padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)',
        borderTop: '1px solid rgba(39,42,58,0.5)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(79,124,255,0.04) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-[680px] mx-auto relative">

        {/* Tension block */}
        <FadeIn>
          <div
            className="mb-12 px-6 py-6 rounded-2xl text-center"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-[15px] leading-[1.8] text-muted mb-4">
              Puedes seguir con una web que está online pero no hace nada.
              <br className="hidden sm:block" />
              O puedes tener algo que trabaje para ti cada día.
            </p>
            <div
              className="text-[14px] leading-[1.7]"
              style={{ color: 'rgba(240,241,245,0.45)' }}
            >
              Si solo buscas algo rápido o lo más barato posible,
              probablemente no soy para ti.
              <br />
              <span style={{ color: 'rgba(240,241,245,0.7)' }}>
                Si buscas algo que funcione de verdad, entonces sí.
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="text-center mb-14">
            <SectionLabel center>Hablemos</SectionLabel>
            <h2
              className="font-head font-bold tracking-[-0.03em] leading-[1.1] mt-3"
              style={{ fontSize: 'clamp(30px,4.5vw,54px)' }}
            >
              Cuéntame tu caso.
              <br />
              En menos de 24h te digo qué haría yo.
            </h2>
            <p
              className="text-muted text-[17px] leading-[1.75] mt-5"
              style={{ maxWidth: 520, margin: '20px auto 0' }}
            >
              Solo necesito saber qué quieres conseguir. Te contesto con una
              propuesta concreta — plazo, coste, cómo lo enfocaría — o te digo
              honestamente si no soy la persona adecuada.
            </p>

            {showUrgency && (
              <div
                className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full"
                style={{
                  border: '1px solid rgba(79,124,255,0.3)',
                  background: 'rgba(79,124,255,0.08)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full block flex-shrink-0 pulse-dot"
                  style={{ background: 'var(--accent)' }}
                />
                <span
                  className="text-[13px] font-head font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  Respondo en menos de 24h · Disponible este mes
                </span>
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          {status === 'sent' ? (
            <div
              className="text-center py-[60px] px-10 rounded-[20px]"
              style={{
                background: 'var(--bg2)',
                border: '1px solid rgba(79,124,255,0.3)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-[22px]"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--accent2))',
                }}
              >
                ✓
              </div>
              <h3 className="font-head font-bold text-[22px] mb-3">
                Mensaje recibido.
              </h3>
              <p className="text-muted text-[15px] leading-[1.7]">
                Te leo con calma y te escribo en menos de 24 horas con lo que
                haría yo en tu caso. Revisa también la carpeta de spam por si
                acaso.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 rounded-[20px]"
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                padding: 'clamp(28px,5vw,48px)',
              }}
            >
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-head font-semibold text-text">
                  Tu email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  {...register('email')}
                  className="form-input"
                  style={{
                    borderColor: errors.email ? '#ff4f4f' : undefined,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = errors.email
                      ? '#ff4f4f'
                      : 'var(--border)')
                  }
                />
                {errors.email && (
                  <p className="text-[12px]" style={{ color: '#ff6b6b' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-head font-semibold text-text">
                  Cuéntame en 2 líneas qué quieres conseguir
                </label>
                <textarea
                  rows={5}
                  placeholder="Ej: Tengo una academia online y necesito una web que consiga más alumnos. O: Tengo una idea de app para gestionar reservas y quiero lanzarla."
                  {...register('mensaje')}
                  className="form-input resize-y"
                  style={{
                    borderColor: errors.mensaje ? '#ff4f4f' : undefined,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = errors.mensaje
                      ? '#ff4f4f'
                      : 'var(--border)')
                  }
                />
                {errors.mensaje && (
                  <p className="text-[12px]" style={{ color: '#ff6b6b' }}>
                    {errors.mensaje.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p className="text-[13px] text-center" style={{ color: '#ff6b6b' }}>
                  Algo salió mal. Intenta de nuevo o escríbeme directamente.
                </p>
              )}

              <SubmitButton sending={status === 'sending'} />

              <p className="text-center text-[12px] text-subtle leading-[1.7]">
                Sin spam. Sin compromiso. Sin formularios eternos.<br />
                Solo una respuesta directa con lo que yo haría en tu caso.
              </p>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
