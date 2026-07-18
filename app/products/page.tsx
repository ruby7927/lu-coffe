import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '豆單｜嚕咖 Lu coffee',
  description: '台灣精品咖啡豆，半磅 (227g) 包裝。特調藍山阿拉比卡、衣索比亞耶加雪菲 G2、衣索比亞古吉罕貝拉 G1，淺焙手沖推薦。',
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>SPECIALTY BEANS</p>
        <h1 className="text-3xl" style={{ color: 'var(--brown)' }}>商品</h1>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          每支豆子都是我們親自試喝篩選，適合手沖的淺焙風味。
        </p>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--cream)' }}>
        {products.map(p => (
          <div key={p.id} className="flex items-center gap-5 md:gap-8 py-7">
            {/* Image */}
            <div className="relative shrink-0 rounded-sm overflow-hidden"
              style={{ width: 96, height: 96, background: '#E8E0D5' }}>
              {p.imageUrl
                ? <Image src={p.imageUrl} alt={p.name} fill sizes="96px" className="object-cover" />
                : null}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline flex-wrap gap-x-2 mb-2">
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--brown)' }}>
                  {p.name}
                </h2>
                {(p.process || p.roastLevel) && (
                  <span className="text-xs md:text-sm" style={{ color: 'var(--muted)' }}>
                    | {[p.process, p.roastLevel].filter(Boolean).join('　')}
                  </span>
                )}
                {p.isSeasonal && (
                  <span className="text-xs px-2 py-0.5" style={{ background: 'var(--sage)', color: 'white' }}>
                    季節限定
                  </span>
                )}
              </div>
              {p.flavorNotes.length > 0 && (
                <div className="inline-block px-3 py-1.5 text-xs md:text-sm"
                  style={{ border: '1px solid var(--brown-light)', color: 'var(--text)' }}>
                  風味：{p.flavorNotes.join('、')}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="shrink-0 text-right">
              <span className="text-3xl md:text-4xl font-light" style={{ color: 'var(--brown)' }}>
                {p.priceRegular}
              </span>
              <span className="text-base ml-0.5" style={{ color: 'var(--brown)' }}>元</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
