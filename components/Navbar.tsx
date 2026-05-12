'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('lu-cart') || '[]')
        setCartCount(cart.reduce((s: number, i: { qty: number }) => s + i.qty, 0))
      } catch { setCartCount(0) }
    }
    update()
    window.addEventListener('storage', update)
    window.addEventListener('lu-cart-updated', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('lu-cart-updated', update)
    }
  }, [])

  return (
    <nav style={{ background: 'var(--cream)', borderBottom: '1px solid var(--brown-light)' }} className="sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/images/lumee2.jpg" alt="嚕咖 Lu coffee" style={{ height: '64px', width: '64px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          <span className="text-2xl tracking-widest font-semibold" style={{ color: 'var(--brown)' }}>Lu Coffee</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-base" style={{ color: 'var(--text)' }}>
          <Link href="/products" className="hover:opacity-70 transition-opacity tracking-wide">豆單</Link>
          <Link href="/blog" className="hover:opacity-70 transition-opacity tracking-wide">文章</Link>
          <Link href="/about" className="hover:opacity-70 transition-opacity tracking-wide">關於我們</Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)} style={{ color: 'var(--brown)' }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            {menuOpen
              ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm" style={{ color: 'var(--text)' }}>
          <Link href="/products" onClick={() => setMenuOpen(false)}>豆單</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>文章</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>關於我們</Link>
        </div>
      )}
    </nav>
  )
}
