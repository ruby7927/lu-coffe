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
  const data = await request.json()
  const product = await prisma.product.update({ where: { id }, data })
  return Response.json(product)
}
