'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type CartItem = { id: string; name: string; size: string; price: number; qty: number }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('lu-cart') || '[]'))
    } catch { setCart([]) }
  }, [])

  function update(id: string, size: string, delta: number) {
    const next = cart.map(i => i.id === id && i.size === size ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    setCart(next)
    localStorage.setItem('lu-cart', JSON.stringify(next))
    window.dispatchEvent(new Event('lu-cart-updated'))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="text-lg mb-6" style={{ color: 'var(--muted)' }}>購物車是空的</p>
      <Link href="/products" className="text-sm tracking-widest underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--brown)' }}>
        去看豆單
      </Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl mb-10" style={{ color: 'var(--brown)' }}>購物車</h1>

      <div className="space-y-4 mb-10">
        {cart.map(item => (
          <div key={`${item.id}-${item.size}`} className="flex items-center justify-between py-4"
            style={{ borderBottom: '1px solid var(--cream)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--text)' }}>{item.name}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.size} · NT${item.price}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => update(item.id, item.size, -1)}
                  className="w-7 h-7 flex items-center justify-center text-lg leading-none transition-opacity hover:opacity-60"
                  style={{ border: '1px solid var(--brown-light)', color: 'var(--brown)' }}>−</button>
                <span className="text-sm w-4 text-center">{item.qty}</span>
                <button onClick={() => update(item.id, item.size, 1)}
                  className="w-7 h-7 flex items-center justify-center text-lg leading-none transition-opacity hover:opacity-60"
                  style={{ border: '1px solid var(--brown-light)', color: 'var(--brown)' }}>+</button>
              </div>
              <span className="text-sm font-medium w-20 text-right" style={{ color: 'var(--brown)' }}>
                NT${item.price * item.qty}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8 text-base font-semibold" style={{ color: 'var(--brown)' }}>
        <span>小計</span>
        <span>NT${subtotal}</span>
      </div>

      <button onClick={() => router.push('/checkout')}
        className="w-full py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
        style={{ background: 'var(--brown)', color: 'white' }}>
        前往結帳
      </button>
    </div>
  )
}
