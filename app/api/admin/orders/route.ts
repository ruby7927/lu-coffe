import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const pw = request.headers.get('x-admin-pw')
  if (pw !== process.env.ADMIN_PASSWORD) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(orders)
}
