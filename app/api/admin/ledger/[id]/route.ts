import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRequest } from '@/lib/auth'

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (body.date !== undefined) data.date = new Date(body.date)
  if (body.name !== undefined) data.name = body.name
  if (body.expense !== undefined) data.expense = Number(body.expense) || 0
  if (body.income !== undefined) data.income = Number(body.income) || 0
  if (body.notes !== undefined) data.notes = body.notes || null

  const entry = await prisma.ledgerEntry.update({ where: { id }, data })
  return Response.json(entry)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.ledgerEntry.delete({ where: { id } })
  return Response.json({ ok: true })
}
