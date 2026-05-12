import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const orderNumber = searchParams.get('orderNumber')?.trim().toUpperCase()
  const phone = searchParams.get('phone')?.trim()

  if (!orderNumber || !phone) {
    return Response.json({ error: '請輸入訂單編號與手機號碼' }, { status: 400 })
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber, phone },
    include: { items: { include: { product: true } } },
  })

  if (!order) {
    return Response.json({ error: '查無此訂單，請確認訂單編號與手機號碼是否正確' }, { status: 404 })
  }

  return Response.json(order)
}
