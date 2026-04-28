import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

function csvCell(value: string | null | undefined): string {
  const s = value ?? ''
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

export async function GET() {
  if (!cookies().has('admin-auth')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    select: { email: true, mensaje: true, tipo: true, status: true, source: true, createdAt: true },
  })

  const header = 'email,mensaje,tipo,status,source,fecha'
  const rows = leads.map(l =>
    [l.email, l.mensaje, l.tipo, l.status, l.source, l.createdAt.toISOString()]
      .map(csvCell).join(',')
  )
  const csv = [header, ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
