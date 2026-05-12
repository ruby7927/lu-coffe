import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest) {
  return request.headers.get('x-admin-pw') === process.env.ADMIN_PASSWORD
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now()
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: 'desc' } })
  return Response.json(posts)
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { title, category, excerpt, content, coverImage, isPublished } = await request.json()
  if (!title || !category || !content) return Response.json({ error: 'missing fields' }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      slug: toSlug(title),
      title, category, excerpt: excerpt || '', content,
      coverImage: coverImage || null,
      isPublished: isPublished ?? false,
    },
  })
  return Response.json(post)
}
