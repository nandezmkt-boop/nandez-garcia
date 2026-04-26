import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['new', 'contacted', 'closed']

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()
    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }
    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { status },
    })
    return Response.json({ ok: true, lead })
  } catch {
    return Response.json({ error: 'Error updating lead' }, { status: 500 })
  }
}
