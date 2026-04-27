import { prisma } from '@/lib/prisma'
import { generateAndStoreLeadResponse } from '@/lib/ai-response'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ ok: true, response: result.response })
  } catch (err) {
    console.error('[generate-response] Unhandled error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
