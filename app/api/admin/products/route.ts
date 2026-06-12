import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return Response.json(products)
}
