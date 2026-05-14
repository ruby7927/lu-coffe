import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '豆單｜嚕咖 Lu coffee',
  description: '台灣精品咖啡豆，淺焙手沖推薦。衣索比亞耶加雪菲、哥倫比亞薇拉，以及每季限定豆。',
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>SPECIALTY BEANS</p>
        <h1 className="text-3xl" style={{ color: 'var(--brown)' }}>本月豆單</h1>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          每支豆子都是我們親自試喝篩選，適合手沖的淺焙風味。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
        {products.map(p => (
          <Link key={p.id} href={`/products/${p.slug}`}
            className="group block rounded-sm overflow-hidden transition-shadow hover:shadow-md"
            style={{ background: 'var(--cream)' }}>
            <div className="relative aspect-square flex items-center justify-center text-xs" style={{ background: '#E8E0D5', color: 'var(--muted)' }}>
              {p.imageUrl
                ? <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                : '商品圖片'}
            </div>
            <div className="p-5 md:p-6">
              {p.isSeasonal && (
                <span className="text-xs tracking-wider px-2 py-1 mb-3 inline-block" style={{ background: 'var(--sage)', color: 'white' }}>
                  季節限定
                </span>
              )}
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--brown)' }}>{p.name}</h2>
              <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{p.origin}・{p.roastLevel}・{p.process}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {p.flavorNotes.map(n => (
                  <span key={n} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>{n}</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>{p.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm" style={{ color: 'var(--brown)' }}>
                  <span>100g NT${p.price100g}</span>
                  <span className="mx-2 opacity-40">|</span>
                  <span>200g NT${p.price200g}</span>
                </div>
                <span className="text-xs tracking-wider underline underline-offset-2 group-hover:opacity-70" style={{ color: 'var(--brown)' }}>
                  了解更多
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
