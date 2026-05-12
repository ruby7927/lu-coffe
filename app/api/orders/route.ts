import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateOrderNumber() {
  const now = new Date()
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `LC${ymd}${rand}`
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { customerName, phone, email, address, shippingMethod, paymentMethod, notes, items, subtotal, shippingFee, total } = body

  if (!customerName || !phone || !items?.length) {
    return Response.json({ error: 'missing required fields' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName,
      phone,
      email: email || null,
      address: address || '',
      shippingMethod,
      paymentMethod,
      notes: notes || null,
      subtotal,
      shippingFee,
      total,
      items: {
        create: items.map((i: { productId: string; size: string; quantity: number; price: number }) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
  })

  return Response.json({ orderId: order.id, orderNumber: order.orderNumber })
}
