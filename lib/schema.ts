import { z } from 'zod'

export const contactSchema = z.object({
  email: z.string().email('Introduce un email válido'),
  mensaje: z
    .string()
    .min(20, 'Cuéntame un poco más (mínimo 20 caracteres)')
    .max(1000),
  tipo: z.enum(['negocio', 'idea', 'no-claro']).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
