import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { generateAndStoreLeadResponse } from '@/lib/ai-response'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!cookies().has('admin-auth')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const force = url.searchParams.get('force') === '1'

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      select: { id: true, email: true, mensaje: true, tipo: true },
    })

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    const result = await generateAndStoreLeadResponse(lead, { force })

    if (!result.ok) {
      console.error('[generate-response] AI error:', result.error)
      return Response.json({ error: 'No se pudo generar la respuesta' }, { status: 500 })
    }

    return Response.json({ ok: true, response: result.response })
  } catch (err) {
    console.error('[generate-response] Unhandled error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
