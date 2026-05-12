import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest) {
  const pw = request.headers.get('x-admin-pw')
  return pw === process.env.ADMIN_PASSWORD
}

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const { status } = await request.json()
  const order = await prisma.order.update({ where: { id }, data: { status } })
  return Response.json(order)
}
