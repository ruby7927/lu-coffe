import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

const SHIPPING_LABELS: Record<string, string> = {
  YAMATO: '黑貓宅急便',
  SEVEN: '7-11 取貨',
  SELF: '自取',
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  })
  if (!order) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-4xl mb-4">☕</div>
        <h1 className="text-2xl mb-2" style={{ color: 'var(--brown)' }}>訂單已送出</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>訂單編號：{order.orderNumber}</p>
      </div>

      <div className="p-6 rounded-sm mb-8 space-y-3" style={{ background: 'var(--cream)' }}>
        <p className="text-xs tracking-wider mb-4" style={{ color: 'var(--muted)' }}>訂單明細</p>
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
        <div className="flex justify-between font-semibold pt-1" style={{ color: 'var(--brown)' }}>
          <span>合計</span>
          <span>NT${order.total}</span>
        </div>
      </div>

      <div className="text-sm leading-loose space-y-2 mb-10" style={{ color: 'var(--text)' }}>
        <p><span style={{ color: 'var(--muted)' }}>收件人：</span>{order.customerName}</p>
        <p><span style={{ color: 'var(--muted)' }}>手機：</span>{order.phone}</p>
        <p><span style={{ color: 'var(--muted)' }}>運送：</span>{SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod}</p>
        {order.address && <p><span style={{ color: 'var(--muted)' }}>地址：</span>{order.address}</p>}
      </div>

      {order.paymentMethod === 'TRANSFER' && (
        <div className="p-5 rounded-sm mb-10" style={{ background: '#FFF8F0', border: '1px solid var(--brown-light)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--brown)' }}>銀行轉帳資訊</p>
          <div className="text-sm space-y-1" style={{ color: 'var(--text)' }}>
            <p>銀行：（請向店家確認）</p>
            <p>帳號：（請向店家確認）</p>
            <p>金額：NT${order.total}</p>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
            轉帳完成後請告知後五碼，我們會盡快確認並出貨。
          </p>
        </div>
      )}

      {order.paymentMethod === 'COD' && (
        <div className="p-5 rounded-sm mb-10 text-sm" style={{ background: '#FFF8F0', border: '1px solid var(--brown-light)', color: 'var(--text)' }}>
          付款方式：貨到付款。收到包裹時請支付 NT${order.total}。
        </div>
      )}

      <div className="text-center">
        <Link href="/products" className="text-sm tracking-widest underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--brown)' }}>
          繼續選豆
        </Link>
      </div>
    </div>
  )
}
