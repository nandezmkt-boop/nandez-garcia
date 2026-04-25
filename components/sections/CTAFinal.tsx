'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/schema'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'
import Link from 'next/link'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

const TIPO_OPTIONS = [
  { value: 'negocio', label: 'Una página que capte clientes' },
  { value: 'idea', label: 'Lanzar una idea' },
  { value: 'no-claro', label: 'No lo tengo claro aún' },
] as const

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

// Bloque persuasivo condensado — usado en la home. Enlaza a /contacto.
export function CTAFinalCTA({ showUrgency = true }: { showUrgency?: boolean }) {
  return (
    <section
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
        <FadeIn>
          <div className="text-center">
            <SectionLabel center>Hablemos</SectionLabel>
            <h2
              className="font-head font-bold tracking-[-0.03em] leading-[1.15] mt-3"
              style={{ fontSize: 'clamp(28px,4vw,48px)' }}
            >
              Cuéntame tu caso. En menos de 24h te digo qué haría yo.
            </h2>
            <p
              className="text-muted text-[17px] leading-[1.75] mt-5"
              style={{ maxWidth: 520, margin: '20px auto 0' }}
            >
              Plazo, coste y enfoque concretos. O un "no encajo" honesto.
            </p>

            {showUrgency && (
              <div
                className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full"
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
                  Disponible este mes · Respondo en &lt;24h
                </span>
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="text-center mt-10">
            <Link
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
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// Formulario completo — usado exclusivamente en /contacto.
export function CTAFinal({ showUrgency = true }: { showUrgency?: boolean }) {
  return (
    <Suspense fallback={<CTAFinalSkeleton showUrgency={showUrgency} />}>
      <CTAFinalForm showUrgency={showUrgency} />
    </Suspense>
  )
}

function CTAFinalSkeleton({ showUrgency }: { showUrgency: boolean }) {
  return (
    <section
      id="contacto"
      className="relative"
      style={{
        padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px)',
        borderTop: '1px solid rgba(39,42,58,0.5)',
      }}
    >
      <div className="max-w-[680px] mx-auto relative">
        <div className="text-center mb-10">
          <h1
            className="font-head font-bold tracking-[-0.03em] leading-[1.1]"
            style={{ fontSize: 'clamp(30px,4.5vw,54px)' }}
          >
            Cuéntame tu caso.
          </h1>
          <p className="text-muted text-[16px] leading-[1.75] mt-4">
            Email + 2 líneas. Te respondo en &lt;24h con qué haría yo.
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
      </div>
    </section>
  )
}

function CTAFinalForm({ showUrgency }: { showUrgency: boolean }) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const searchParams = useSearchParams()
  const tipoFromUrl = searchParams.get('tipo')
  const initialTipo =
    tipoFromUrl === 'negocio' || tipoFromUrl === 'idea' || tipoFromUrl === 'no-claro'
      ? tipoFromUrl
      : undefined

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { tipo: initialTipo },
  })

  useEffect(() => {
    if (initialTipo) setValue('tipo', initialTipo)
  }, [initialTipo, setValue])

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
        <FadeIn>
          <div className="text-center mb-10">
            <h1
              className="font-head font-bold tracking-[-0.03em] leading-[1.1]"
              style={{ fontSize: 'clamp(30px,4.5vw,54px)' }}
            >
              Cuéntame tu caso.
            </h1>
            <p className="text-muted text-[16px] leading-[1.75] mt-4">
              Email + 2 líneas. Te respondo en &lt;24h con qué haría yo.
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

        <FadeIn delay={0.1}>
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
              <p className="text-muted text-[15px] leading-[1.7] mb-6">
                Te leo con calma y te escribo en menos de 24 horas con lo que
                haría yo en tu caso. Revisa también la carpeta de spam por si
                acaso.
              </p>
              <Link
                href="/#testimonios"
                className="inline-flex items-center gap-1 text-[14px] font-head font-semibold no-underline transition-transform duration-200 hover:translate-x-0.5"
                style={{ color: 'var(--accent)' }}
              >
                Mientras tanto, mira casos reales →
              </Link>
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
                  ¿Qué necesitas?{' '}
                  <span className="text-subtle font-normal">(opcional)</span>
                </label>
                <div className="flex flex-col gap-2 mt-1">
                  {TIPO_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 cursor-pointer text-[14px] text-muted hover:text-text transition-colors"
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('tipo')}
                        className="accent-accent"
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

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
                {errors.email ? (
                  <p className="text-[12px]" style={{ color: '#ff6b6b' }}>
                    {errors.email.message}
                  </p>
                ) : (
                  <p className="text-[12px] text-subtle">
                    Solo lo uso para responderte. Sin newsletter.
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
                Sin spam. Sin compromiso. Sin formularios eternos.
              </p>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
