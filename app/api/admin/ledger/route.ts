import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const entries = await prisma.ledgerEntry.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  })
  return Response.json(entries)
}

export async function POST(request: NextRequest) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const body = await request.json()
  const { date, name, expense, income, notes } = body

  if (!date || !name) return Response.json({ error: '請填寫日期與名稱' }, { status: 400 })
  const exp = Number(expense) || 0
  const inc = Number(income) || 0
  if (exp < 0 || inc < 0) return Response.json({ error: '金額不可為負數' }, { status: 400 })
  if (exp === 0 && inc === 0) return Response.json({ error: '請填寫支出或收入金額' }, { status: 400 })

  const entry = await prisma.ledgerEntry.create({
    data: {
      date: new Date(date),
      name,
      expense: exp,
      income: inc,
      notes: notes || null,
    },
  })
  return Response.json(entry)
}
