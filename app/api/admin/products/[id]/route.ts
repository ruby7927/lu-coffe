import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRequest } from '@/lib/auth'

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  // If slug being changed, ensure unique
  if (body.slug) {
    const existing = await prisma.product.findUnique({ where: { slug: body.slug } })
    if (existing && existing.id !== id) {
      return Response.json({ error: `slug "${body.slug}" 已被其他商品使用` }, { status: 400 })
    }
  }

  // Coerce numeric fields
  const data: Record<string, unknown> = { ...body }
  if (data.priceRegular !== undefined) data.priceRegular = Number(data.priceRegular)
  if (data.priceCommunity !== undefined) data.priceCommunity = Number(data.priceCommunity)
  if (data.sortOrder !== undefined) data.sortOrder = Number(data.sortOrder)

  const product = await prisma.product.update({ where: { id }, data })
  return Response.json(product)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params

  // Hard delete only if no related orderItems; otherwise soft-delete (deactivate)
  const itemCount = await prisma.orderItem.count({ where: { productId: id } })
  if (itemCount > 0) {
    const product = await prisma.product.update({ where: { id }, data: { isActive: false } })
    return Response.json({ softDeleted: true, product })
  }
  await prisma.product.delete({ where: { id } })
  return Response.json({ ok: true })
}
