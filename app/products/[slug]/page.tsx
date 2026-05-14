import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return {}
  return {
    title: `${product.name}｜嚕咖 Lu coffee`,
    description: `${product.origin}・${product.roastLevel}・${product.process}。${product.description}`,
    keywords: ['台灣咖啡豆', '淺焙咖啡豆', '手沖咖啡豆推薦', product.name],
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product || !product.isActive) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-start">
        {/* Image */}
        <div className="relative aspect-square rounded-sm overflow-hidden flex items-center justify-center text-sm"
          style={{ background: '#E8E0D5', color: 'var(--muted)' }}>
          {product.imageUrl
            ? <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            : '商品圖片'}
        </div>

        {/* Info */}
        <div>
          {product.isSeasonal && (
            <span className="text-xs tracking-wider px-2 py-1 mb-4 inline-block" style={{ background: 'var(--sage)', color: 'white' }}>
              季節限定
            </span>
          )}
          <h1 className="text-3xl mb-2" style={{ color: 'var(--brown)' }}>{product.name}</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>{product.origin}・{product.roastLevel}・{product.process}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.flavorNotes.map(n => (
              <span key={n} className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--cream)', color: 'var(--brown)' }}>{n}</span>
            ))}
          </div>

          <p className="text-base leading-loose mb-8" style={{ color: 'var(--text)' }}>{product.description}</p>

          <div className="mb-8 p-4 rounded-sm" style={{ background: 'var(--cream)' }}>
            <p className="text-xs tracking-wider mb-3" style={{ color: 'var(--muted)' }}>價格</p>
            <div className="space-y-2 text-sm" style={{ color: 'var(--brown)' }}>
              <p>100g — NT${product.price100g}</p>
              <p>200g — NT${product.price200g}</p>
            </div>
          </div>

          <a href="https://s.shopee.tw/10zagmy7Rk" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
            style={{ background: 'var(--brown)', color: 'white' }}>
            🛒 前往蝦皮下單
          </a>
        </div>
      </div>
    </div>
  )
}
