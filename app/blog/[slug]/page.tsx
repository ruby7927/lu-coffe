import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PostContent from '@/components/PostContent'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

const CATEGORY_LABELS: Record<string, string> = {
  BEAN: '豆子介紹',
  BREW: '沖煮教學',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  if (!post) return {}
  return {
    title: `${post.title}｜嚕咖 Lu coffee`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  if (!post || !post.isPublished) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link href="/blog" className="text-xs tracking-wider hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
          ← 返回文章列表
        </Link>
      </div>

      <span className="text-xs tracking-wider px-2 py-0.5 mb-4 inline-block" style={{ background: 'var(--cream)', color: 'var(--muted)' }}>
        {CATEGORY_LABELS[post.category] || post.category}
      </span>

      <h1 className="text-3xl mb-4 leading-snug" style={{ color: 'var(--brown)' }}>{post.title}</h1>

      <p className="text-xs mb-10" style={{ color: 'var(--brown-light)' }}>
        {new Date(post.publishedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {post.coverImage && (
        <div className="relative w-full aspect-[16/10] mb-10 rounded-sm overflow-hidden" style={{ background: '#E8E0D5' }}>
          <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
        </div>
      )}

      <PostContent content={post.content} />

      <div className="mt-16 pt-8 text-center" style={{ borderTop: '1px solid var(--cream)' }}>
        <Link href="/blog" className="text-sm tracking-widest underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--brown)' }}>
          閱讀更多文章
        </Link>
      </div>
    </div>
  )
}
