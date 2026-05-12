'use client'
import { useState } from 'react'

type Product = { id: string; name: string; price100g: number; price200g: number }

export default function AddToCartButton({ product }: { product: Product }) {
  const [size, setSize] = useState<'100g' | '200g'>('100g')
  const [added, setAdded] = useState(false)

  function addToCart() {
    const price = size === '100g' ? product.price100g : product.price200g
    const cart = JSON.parse(localStorage.getItem('lu-cart') || '[]')
    const existing = cart.find((i: { id: string; size: string }) => i.id === product.id && i.size === size)
    if (existing) {
      existing.qty += 1
    } else {
      cart.push({ id: product.id, name: product.name, size, price, qty: 1 })
    }
    localStorage.setItem('lu-cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('lu-cart-updated'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {(['100g', '200g'] as const).map(s => (
          <button key={s} onClick={() => setSize(s)}
            className="px-5 py-2 text-sm transition-all"
            style={{
              background: size === s ? 'var(--brown)' : 'transparent',
              color: size === s ? 'white' : 'var(--brown)',
              border: '1px solid var(--brown)',
            }}>
            {s} — NT${s === '100g' ? product.price100g : product.price200g}
          </button>
        ))}
      </div>
      <button onClick={addToCart}
        className="w-full py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
        style={{ background: 'var(--brown)', color: 'white' }}>
        {added ? '已加入購物車 ✓' : '加入購物車'}
      </button>
    </div>
  )
}
