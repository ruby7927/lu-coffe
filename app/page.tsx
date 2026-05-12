import Link from 'next/link'
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
      <section className="w-full py-8 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row rounded-sm overflow-hidden" style={{ minHeight: '420px' }}>
        {/* Left: text block */}
        <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-16" style={{ background: 'var(--cream)' }}>
          <h1 className="mb-3" style={{ color: 'var(--brown)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, letterSpacing: '0.28em', lineHeight: 1.1 }}>
            LU COFFEE
          </h1>
          <p className="mb-4" style={{ color: 'var(--brown)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
            用一杯好咖啡，找回生活的節奏
          </p>
          <p className="mb-5" style={{ fontSize: '1.5rem' }}>🐾</p>
          <p className="mb-10" style={{ color: 'var(--text)', fontSize: '1.15rem', lineHeight: 2, letterSpacing: '0.05em' }}>
            每一杯咖啡，都是對生活的溫柔<br />
            有你，也有嚕陪伴
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products"
              className="inline-block px-8 py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
              style={{ background: 'var(--brown)', color: 'white' }}>
              看豆單
            </Link>
            <a href="https://s.shopee.tw/10zagmy7Rk" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
              style={{ border: '1px solid var(--brown)', color: 'var(--brown)' }}>
              🛒 蝦皮賣場
            </a>
          </div>
        </div>

        {/* Right: photo */}
        <div className="w-full md:w-1/2 flex items-center justify-center" style={{ background: '#E8E0D5', minHeight: '320px' }}>
          <img
            src="/images/lumee.jpg.png"
            alt="嚕咪與 Lu Coffee"
            className="w-full h-full object-contain"
            style={{ maxHeight: '560px' }}
          />
        </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>OUR BEANS</p>
          <h2 className="text-2xl" style={{ color: 'var(--brown)' }}>本月豆單</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {products.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`}
              className="group block rounded-sm transition-shadow hover:shadow-md"
              style={{ background: 'var(--cream)' }}>
              <div className="h-64 overflow-hidden flex items-center justify-center text-sm" style={{ background: '#E8E0D5', color: 'var(--muted)' }}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : '商品圖片'}
              </div>
              <div className="p-5">
                {p.isSeasonal && (
                  <span className="text-sm tracking-wider px-2 py-0.5 mb-3 inline-block" style={{ background: 'var(--sage)', color: 'white' }}>
                    季節限定
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brown)' }}>{p.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{p.roastLevel}・{p.process}</p>
                <p className="text-base font-medium" style={{ color: 'var(--brown)' }}>
                  NT${p.price100g} 起
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Story Snippet */}
      <section className="py-20" style={{ background: 'var(--cream)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] mb-6" style={{ color: 'var(--brown-light)' }}>OUR STORY</p>
          <blockquote className="text-lg leading-loose mb-8" style={{ color: 'var(--text)' }}>
            「嚕咖的名字，來自我家狗狗嚕咪。<br />
            那一刻突然懂了——好的生活，不需要很複雜。<br />
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
