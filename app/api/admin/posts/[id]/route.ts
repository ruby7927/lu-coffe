import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest) {
  return request.headers.get('x-admin-pw') === process.env.ADMIN_PASSWORD
}

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await request.json()
  const post = await prisma.post.update({ where: { id }, data })
  return Response.json(post)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.post.delete({ where: { id } })
  return Response.json({ ok: true })
}
