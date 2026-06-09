import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '關於我們｜嚕咖 Lu coffee',
  description: '嚕咖的故事，從一隻叫嚕咪的白色小狗開始。用一杯好咖啡，找回生活的節奏。',
}

export default function AboutPage() {
  return (
    <div>
      {/* Landscape photo with side margins */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <div className="relative w-full aspect-[16/10] md:aspect-[16/8] overflow-hidden rounded-sm">
          <Image
            src="/images/lumee3.jpg"
            alt="嚕咪與 Lu Coffee"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            style={{ objectPosition: 'center center' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>OUR STORY</p>
          <h1 className="text-3xl" style={{ color: 'var(--brown)' }}>關於嚕咖</h1>
        </div>

        <div className="max-w-xl mx-auto">
          <h2 className="text-xl mb-6" style={{ color: 'var(--brown)' }}>嚕咖的名字，來自嚕咪</h2>
          <div className="text-base leading-loose space-y-4" style={{ color: 'var(--text)' }}>
            <p>嚕咖的名字，來自我家狗狗嚕咪。</p>
            <p>
              決定轉換生活的那天，我坐在窗邊手沖咖啡，嚕咪趴在腳邊，抬頭看了我一眼又繼續睡。
              那一刻突然懂了好的生活，不需要很複雜。
              一杯咖啡、一隻狗、陽光照進來。
            </p>
            <p>
              嚕咖 Lu coffee，是我和嚕咪一起追求那種生活的起點。
              每一支豆子，都是我親自試喝篩選的，希望你沖那杯咖啡的時候，也能慢下來一點點。
            </p>
            <p>
              目前固定供應三支精品豆，全部委託專業烘豆師代工，在黃金賞味期內出貨。
            </p>
          </div>
        </div>

        <div className="text-center mt-16 py-12" style={{ borderTop: '1px solid var(--cream)' }}>
          <blockquote className="text-lg leading-loose italic" style={{ color: 'var(--brown)' }}>
            「慢下來一點點，陽光照進來。」
          </blockquote>
        </div>
      </div>
    </div>
  )
}
