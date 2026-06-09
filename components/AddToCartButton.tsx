'use client'
import { useState } from 'react'

type Product = { id: string; name: string; priceRegular: number }

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)

  function addToCart() {
    const size = '半磅 (227g)'
    const price = product.priceRegular
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
    <button onClick={addToCart}
      className="w-full py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
      style={{ background: 'var(--brown)', color: 'white' }}>
      {added ? '已加入購物車 ✓' : '加入購物車'}
    </button>
  )
}
