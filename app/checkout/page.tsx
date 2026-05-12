'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type CartItem = { id: string; name: string; size: string; price: number; qty: number }

const SHIPPING: Record<string, { label: string; fee: number }> = {
  YAMATO: { label: '黑貓宅急便', fee: 100 },
  SEVEN: { label: '7-11 取貨', fee: 60 },
  SELF: { label: '自取（免運）', fee: 0 },
}

const PAYMENT: Record<string, string> = {
  COD: '貨到付款',
  TRANSFER: '銀行轉帳',
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })
  const [shipping, setShipping] = useState('YAMATO')
  const [payment, setPayment] = useState('TRANSFER')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem('lu-cart') || '[]')) } catch { setCart([]) }
  }, [])

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const shippingFee = SHIPPING[shipping].fee
  const total = subtotal + shippingFee

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cart.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          shippingMethod: shipping,
          paymentMethod: payment,
          notes,
          items: cart.map(i => ({ productId: i.id, size: i.size, quantity: i.qty, price: i.price })),
          subtotal,
          shippingFee,
          total,
        }),
      })
      if (!res.ok) throw new Error()
      const { orderId } = await res.json()
      localStorage.removeItem('lu-cart')
      window.dispatchEvent(new Event('lu-cart-updated'))
      router.push(`/order/${orderId}`)
    } catch {
      alert('下單失敗，請稍後再試')
      setSubmitting(false)
    }
  }

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p style={{ color: 'var(--muted)' }}>請先加入商品</p>
    </div>
  )

  const inputClass = "w-full px-3 py-2 text-sm outline-none"
  const inputStyle = { border: '1px solid var(--brown-light)', background: 'var(--bg)', color: 'var(--text)' }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl mb-10" style={{ color: 'var(--brown)' }}>結帳</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Order summary */}
        <div className="p-5 rounded-sm space-y-2" style={{ background: 'var(--cream)' }}>
          <p className="text-xs tracking-wider mb-3" style={{ color: 'var(--muted)' }}>訂單明細</p>
          {cart.map(i => (
            <div key={`${i.id}-${i.size}`} className="flex justify-between text-sm">
              <span style={{ color: 'var(--text)' }}>{i.name} {i.size} × {i.qty}</span>
              <span style={{ color: 'var(--brown)' }}>NT${i.price * i.qty}</span>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div>
          <p className="text-xs tracking-wider mb-4" style={{ color: 'var(--muted)' }}>運送方式</p>
          <div className="space-y-2">
            {Object.entries(SHIPPING).map(([k, v]) => (
              <label key={k} className="flex items-center gap-3 cursor-pointer text-sm" style={{ color: 'var(--text)' }}>
                <input type="radio" name="shipping" value={k} checked={shipping === k} onChange={() => setShipping(k)} />
                {v.label} {v.fee > 0 ? `+NT$${v.fee}` : ''}
              </label>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div>
          <p className="text-xs tracking-wider mb-4" style={{ color: 'var(--muted)' }}>付款方式</p>
          <div className="space-y-2">
            {Object.entries(PAYMENT).map(([k, v]) => (
              <label key={k} className="flex items-center gap-3 cursor-pointer text-sm" style={{ color: 'var(--text)' }}>
                <input type="radio" name="payment" value={k} checked={payment === k} onChange={() => setPayment(k)} />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* Customer info */}
        <div className="space-y-4">
          <p className="text-xs tracking-wider" style={{ color: 'var(--muted)' }}>收件人資料</p>
          <input required placeholder="姓名" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} style={inputStyle} />
          <input required placeholder="手機" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} style={inputStyle} />
          <input placeholder="Email（選填，用於收據）" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} style={inputStyle} />
          {shipping !== 'SELF' && (
            <input required placeholder="收件地址" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputClass} style={inputStyle} />
          )}
          <textarea placeholder="備註（選填）" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
        </div>

        {/* Total */}
        <div className="flex justify-between text-base font-semibold py-4" style={{ borderTop: '1px solid var(--cream)', color: 'var(--brown)' }}>
          <span>合計（含運費）</span>
          <span>NT${total}</span>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full py-3 text-sm tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: 'var(--brown)', color: 'white' }}>
          {submitting ? '處理中...' : '確認下單'}
        </button>
      </form>
    </div>
  )
}
