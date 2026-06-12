import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 3,
  })

  return (
    <>
      {/* Hero — split layout */}
      <section className="w-full py-4 md:py-8 px-3 md:px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row rounded-sm overflow-hidden md:min-h-[420px]">
          {/* Left: text block */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 md:py-16" style={{ background: 'var(--cream)' }}>
            <h1 className="mb-3" style={{ color: 'var(--brown)', fontSize: 'clamp(1.75rem, 8vw, 3.2rem)', fontWeight: 300, letterSpacing: '0.18em', lineHeight: 1.1 }}>
              LU COFFEE
            </h1>
            <p className="mb-4 text-base md:text-lg" style={{ color: 'var(--brown)', letterSpacing: '0.08em' }}>
              用一杯好咖啡，找回生活的節奏
            </p>
            <p className="mb-5 text-2xl">🐾</p>
            <p className="mb-8 md:mb-10 text-base md:text-lg" style={{ color: 'var(--text)', lineHeight: 2, letterSpacing: '0.05em' }}>
              每一杯咖啡，都是對生活的溫柔<br />
              有你，也有嚕陪伴
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <Link href="/products"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
                style={{ background: 'var(--brown)', color: 'white' }}>
                看豆單
              </Link>
              <a href="https://s.shopee.tw/10zagmy7Rk" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--brown)', color: 'var(--brown)' }}>
                🛒 蝦皮賣場
              </a>
            </div>
          </div>

          {/* Right: photo */}
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[320px]" style={{ background: '#E8E0D5' }}>
            <Image
              src="/images/lumee.jpg.png"
              alt="嚕咪與 Lu Coffee"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>OUR BEANS</p>
          <h2 className="text-2xl" style={{ color: 'var(--brown)' }}>當前豆單</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {products.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`}
              className="group block rounded-sm transition-shadow hover:shadow-md overflow-hidden"
              style={{ background: 'var(--cream)' }}>
              <div className="relative aspect-square overflow-hidden flex items-center justify-center text-sm" style={{ background: '#E8E0D5', color: 'var(--muted)' }}>
                {p.imageUrl
                  ? <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  : '商品圖片'}
              </div>
              <div className="p-4 sm:p-5">
                {p.isSeasonal && (
                  <span className="text-xs tracking-wider px-2 py-0.5 mb-3 inline-block" style={{ background: 'var(--sage)', color: 'white' }}>
                    季節限定
                  </span>
                )}
                <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: 'var(--brown)' }}>{p.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{p.roastLevel}・{p.process}</p>
                <p className="text-base font-medium" style={{ color: 'var(--brown)' }}>
                  半磅 NT${p.priceRegular}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Story Snippet */}
      <section className="py-14 md:py-20" style={{ background: 'var(--cream)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] mb-6" style={{ color: 'var(--brown-light)' }}>OUR STORY</p>
          <blockquote className="text-base md:text-lg leading-loose mb-8" style={{ color: 'var(--text)' }}>
            「嚕咖的名字，來自我家狗狗嚕咪。<br />
            那一刻突然懂了好的生活，不需要很複雜。<br />
            一杯咖啡、一隻狗、陽光照進來。」
          </blockquote>
          <Link href="/about" className="text-sm tracking-widest underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--brown)' }}>
            閱讀我們的故事
          </Link>
        </div>
      </section>
    </>
  )
}
