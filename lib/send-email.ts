import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(email: string, mensaje: string) {
  return resend.emails.send({
    from: 'web@nandezgarcia.com',
    to: 'hola@nandezgarcia.com',
    reply_to: email,
    subject: `Nuevo lead desde la web — ${email}`,
    html: `
      <h2>Nuevo lead desde la landing</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Proyecto:</strong></p>
      <p>${mensaje.replace(/\n/g, '<br>')}</p>
    `,
  })
}
