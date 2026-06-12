import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })

  // Admin gets ALL products (active + inactive). Consumers filter as needed.
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return Response.json(products)
}

export async function POST(request: NextRequest) {
  if (!(await checkAdminRequest(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const { slug, name, origin, process, roastLevel, flavorNotes, description, imageUrl, priceRegular, priceCommunity, isActive, isSeasonal, sortOrder } = body

  if (!name || !slug) return Response.json({ error: '請填寫名稱與 slug' }, { status: 400 })

  const exists = await prisma.product.findUnique({ where: { slug } })
  if (exists) return Response.json({ error: `slug "${slug}" 已存在` }, { status: 400 })

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      origin: origin || '',
      process: process || '',
      roastLevel: roastLevel || '',
      flavorNotes: Array.isArray(flavorNotes) ? flavorNotes : [],
      description: description || '',
      imageUrl: imageUrl || null,
      priceRegular: Number(priceRegular) || 0,
      priceCommunity: Number(priceCommunity) || 0,
      price100g: 0,
      price200g: 0,
      isActive: isActive ?? true,
      isSeasonal: isSeasonal ?? false,
      sortOrder: Number(sortOrder) || 0,
    },
  })
  return Response.json(product)
}
