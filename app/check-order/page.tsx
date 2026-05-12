'use client'
import { useState } from 'react'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待確認',
  CONFIRMED: '已確認',
  SHIPPED: '已出貨',
  DELIVERED: '已到貨',
  CANCELLED: '已取消',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#B8956A',
  CONFIRMED: '#7A9171',
  SHIPPED: '#5B8DB8',
  DELIVERED: '#9B8E82',
  CANCELLED: '#C4A4A4',
}

const SHIPPING_LABELS: Record<string, string> = {
  YAMATO: '黑貓宅急便',
  SEVEN: '7-11 取貨',
  SELF: '自取',
}

const PAYMENT_LABELS: Record<string, string> = {
  COD: '貨到付款',
  TRANSFER: '銀行轉帳',
}

type OrderItem = { id: string; size: string; quantity: number; price: number; product: { name: string } }
type Order = {
  orderNumber: string; customerName: string; phone: string; address: string
  shippingMethod: string; paymentMethod: string; status: string
  subtotal: number; shippingFee: number; total: number; notes: string | null
  createdAt: string; items: OrderItem[]
}

export default function CheckOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/lookup?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      } else {
        setOrder(data)
      }
    } catch {
      setError('查詢失敗，請稍後再試')
    }
    setLoading(false)
  }

  const inputClass = "w-full px-3 py-2 text-sm outline-none"
  const inputStyle = { border: '1px solid var(--brown-light)', background: 'var(--bg)', color: 'var(--text)' }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>ORDER STATUS</p>
        <h1 className="text-3xl" style={{ color: 'var(--brown)' }}>訂單查詢</h1>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-10">
        <input
          required
          placeholder="訂單編號（例：LC20250508XXXX）"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
        <input
          required
          placeholder="訂購時填寫的手機號碼"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: 'var(--brown)', color: 'white' }}
        >
          {loading ? '查詢中...' : '查詢訂單'}
        </button>
      </form>

      {error && (
        <p className="text-sm text-center py-4" style={{ color: '#C4A4A4' }}>{error}</p>
      )}

      {order && (
        <div className="space-y-6">
          {/* Status */}
          <div className="p-5 rounded-sm text-center" style={{ background: 'var(--cream)' }}>
            <p className="text-xs tracking-wider mb-2" style={{ color: 'var(--muted)' }}>訂單狀態</p>
            <span className="text-xl font-semibold" style={{ color: STATUS_COLORS[order.status] }}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
            <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
              訂單編號：{order.orderNumber}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              下單時間：{new Date(order.createdAt).toLocaleString('zh-TW')}
            </p>
          </div>

          {/* Items */}
          <div className="p-5 rounded-sm space-y-2" style={{ background: 'var(--cream)' }}>
            <p className="text-xs tracking-wider mb-3" style={{ color: 'var(--muted)' }}>訂單明細</p>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span style={{ color: 'var(--text)' }}>{item.product.name} {item.size} × {item.quantity}</span>
                <span style={{ color: 'var(--brown)' }}>NT${item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2" style={{ borderTop: '1px solid #D4C4B0', color: 'var(--muted)' }}>
              <span>運費</span>
              <span>NT${order.shippingFee}</span>
            </div>
            <div className="flex justify-between font-semibold" style={{ color: 'var(--brown)' }}>
              <span>合計</span>
              <span>NT${order.total}</span>
            </div>
          </div>

          {/* Shipping info */}
          <div className="text-sm leading-loose space-y-1 px-1" style={{ color: 'var(--text)' }}>
            <p><span style={{ color: 'var(--muted)' }}>收件人：</span>{order.customerName}</p>
            <p><span style={{ color: 'var(--muted)' }}>運送方式：</span>{SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod}</p>
            {order.address && <p><span style={{ color: 'var(--muted)' }}>收件地址：</span>{order.address}</p>}
            <p><span style={{ color: 'var(--muted)' }}>付款方式：</span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
            {order.notes && <p><span style={{ color: 'var(--muted)' }}>備註：</span>{order.notes}</p>}
          </div>

          {order.status === 'PENDING' && order.paymentMethod === 'TRANSFER' && (
            <div className="p-4 text-sm" style={{ background: '#FFF8F0', border: '1px solid var(--brown-light)', color: 'var(--text)' }}>
              尚未收到匯款確認，請完成轉帳後透過 Instagram 私訊告知後五碼。
            </div>
          )}
        </div>
      )}
    </div>
  )
}
