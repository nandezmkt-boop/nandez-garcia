import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const TIPO_LABELS: Record<string, string> = {
  negocio: 'Una página que capte clientes',
  idea: 'Lanzar una idea',
  'no-claro': 'No lo tengo claro aún',
}

export async function sendContactEmail(
  email: string,
  mensaje: string,
  tipo?: string,
) {
  if (!resend) return

  const tipoLabel = tipo ? TIPO_LABELS[tipo] ?? tipo : null

  return resend.emails.send({
    from: 'web@nandezgarcia.com',
    to: 'hola@nandezgarcia.com',
    reply_to: email,
    subject: `Nuevo lead desde la web — ${email}`,
    html: `
      <h2>Nuevo lead desde la landing</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${tipoLabel ? `<p><strong>Tipo:</strong> ${tipoLabel}</p>` : ''}
      <p><strong>Proyecto:</strong></p>
      <p>${mensaje.replace(/\n/g, '<br>')}</p>
    `,
  })
}
