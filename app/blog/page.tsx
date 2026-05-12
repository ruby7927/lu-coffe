import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章｜嚕咖 Lu coffee',
  description: '咖啡豆介紹、手沖教學，與你分享每一杯咖啡背後的故事。',
}

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  BEAN: '豆子介紹',
  BREW: '沖煮教學',
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })

  const beans = posts.filter(p => p.category === 'BEAN')
  const brews = posts.filter(p => p.category === 'BREW')

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>ARTICLES</p>
        <h1 className="text-3xl" style={{ color: 'var(--brown)' }}>文章</h1>
      </div>

      {posts.length === 0 && (
        <p className="text-center py-20 text-sm" style={{ color: 'var(--muted)' }}>文章即將上線，敬請期待。</p>
      )}

      {beans.length > 0 && (
        <section className="mb-16">
          <h2 className="text-lg font-semibold mb-8 pb-3" style={{ color: 'var(--brown)', borderBottom: '1px solid var(--cream)' }}>豆子介紹</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {beans.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {brews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-8 pb-3" style={{ color: 'var(--brown)', borderBottom: '1px solid var(--cream)' }}>沖煮教學</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {brews.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function PostCard({ post }: { post: { id: string; slug: string; title: string; category: string; excerpt: string; coverImage: string | null; publishedAt: Date } }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group block rounded-sm overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: 'var(--cream)' }}>
      <div className="h-48 overflow-hidden flex items-center justify-center text-sm" style={{ background: '#E8E0D5', color: 'var(--muted)' }}>
        {post.coverImage
          ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : '文章圖片'}
      </div>
      <div className="p-6">
        <span className="text-xs tracking-wider px-2 py-0.5 mb-3 inline-block" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>
          {CATEGORY_LABELS[post.category] || post.category}
        </span>
        <h3 className="text-lg font-semibold mb-2 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--brown)' }}>{post.title}</h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>{post.excerpt}</p>
        <p className="text-xs" style={{ color: 'var(--brown-light)' }}>
          {new Date(post.publishedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </Link>
  )
}
