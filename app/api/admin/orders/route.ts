import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest) {
  const pw = request.headers.get('x-admin-pw')
  return pw === process.env.ADMIN_PASSWORD
}

function generateOrderNumber() {
  const now = new Date()
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `LC${ymd}${rand}`
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(orders)
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    orderNumber,
    customerName,
    phone,
    email,
    address,
    shippingMethod,
    paymentMethod,
    status,
    items,
    subtotal,
    shippingFee,
    total,
    notes,
    createdAt,
  } = body

  if (!customerName || !phone || !items?.length) {
    return Response.json({ error: '請填寫姓名、電話與至少一個品項' }, { status: 400 })
  }

  // Validate items
  for (const i of items) {
    if (!i.productId || !i.size || !i.quantity || i.price == null) {
      return Response.json({ error: '品項資料不完整' }, { status: 400 })
    }
  }

  // Check orderNumber uniqueness if user provided one
  const finalOrderNumber = orderNumber?.trim() || generateOrderNumber()
  if (orderNumber?.trim()) {
    const exists = await prisma.order.findUnique({ where: { orderNumber: finalOrderNumber } })
    if (exists) {
      return Response.json({ error: `訂單編號 ${finalOrderNumber} 已存在` }, { status: 400 })
    }
  }

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: finalOrderNumber,
        customerName,
        phone,
        email: email || null,
        address: address || '',
        shippingMethod: shippingMethod || 'SELF',
        paymentMethod: paymentMethod || 'TRANSFER',
        status: status || 'CONFIRMED',
        subtotal: Number(subtotal) || 0,
        shippingFee: Number(shippingFee) || 0,
        total: Number(total) || 0,
        notes: notes || null,
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
        items: {
          create: items.map((i: { productId: string; size: string; quantity: number; price: number }) => ({
            productId: i.productId,
            size: i.size,
            quantity: Number(i.quantity),
            price: Number(i.price),
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    return Response.json(order)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
