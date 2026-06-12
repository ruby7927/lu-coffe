import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRequest } from '@/lib/auth'

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  // Status-only update (back-compat)
  const keys = Object.keys(body)
  if (keys.length === 1 && keys[0] === 'status') {
    const order = await prisma.order.update({ where: { id }, data: { status: body.status } })
    return Response.json(order)
  }

  // Full edit
  const {
    orderNumber, customerName, phone, email, address,
    shippingMethod, paymentMethod, status,
    items, subtotal, shippingFee, total, notes, createdAt,
  } = body

  // If orderNumber being changed, ensure unique
  if (orderNumber) {
    const existing = await prisma.order.findUnique({ where: { orderNumber } })
    if (existing && existing.id !== id) {
      return Response.json({ error: `訂單編號 ${orderNumber} 已被其他訂單使用` }, { status: 400 })
    }
  }

  // Validate items if provided
  if (items) {
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: '至少需要一個品項' }, { status: 400 })
    }
    for (const i of items) {
      if (!i.productId || !i.size || !i.quantity || i.price == null) {
        return Response.json({ error: '品項資料不完整' }, { status: 400 })
      }
    }
  }

  try {
    // Update order fields, replacing items if provided
    if (items) {
      await prisma.orderItem.deleteMany({ where: { orderId: id } })
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(orderNumber !== undefined ? { orderNumber } : {}),
        ...(customerName !== undefined ? { customerName } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(email !== undefined ? { email: email || null } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(shippingMethod !== undefined ? { shippingMethod } : {}),
        ...(paymentMethod !== undefined ? { paymentMethod } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(subtotal !== undefined ? { subtotal: Number(subtotal) } : {}),
        ...(shippingFee !== undefined ? { shippingFee: Number(shippingFee) } : {}),
        ...(total !== undefined ? { total: Number(total) } : {}),
        ...(notes !== undefined ? { notes: notes || null } : {}),
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
        ...(items
          ? {
              items: {
                create: items.map((i: { productId: string; size: string; quantity: number; price: number }) => ({
                  productId: i.productId,
                  size: i.size,
                  quantity: Number(i.quantity),
                  price: Number(i.price),
                })),
              },
            }
          : {}),
      },
      include: { items: { include: { product: true } } },
    })

    return Response.json(order)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.orderItem.deleteMany({ where: { orderId: id } })
  await prisma.order.delete({ where: { id } })
  return Response.json({ ok: true })
}
