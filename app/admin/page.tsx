'use client'
import { useState, useEffect, useCallback } from 'react'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待確認', CONFIRMED: '已確認', SHIPPED: '已出貨', DELIVERED: '已到貨', CANCELLED: '已取消',
}
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#B8956A', CONFIRMED: '#7A9171', SHIPPED: '#5B8DB8', DELIVERED: '#9B8E82', CANCELLED: '#C4A4A4',
}
const CATEGORY_LABELS: Record<string, string> = { BEAN: '豆子介紹', BREW: '沖煮教學' }

type OrderItem = { id: string; size: string; quantity: number; price: number; product: { name: string } }
type Order = { id: string; orderNumber: string; customerName: string; phone: string; email: string | null; address: string; shippingMethod: string; paymentMethod: string; status: string; subtotal: number; shippingFee: number; total: number; notes: string | null; createdAt: string; items: OrderItem[] }
type Post = { id: string; slug: string; title: string; category: string; excerpt: string; content: string; coverImage: string | null; isPublished: boolean; publishedAt: string }
type Product = { id: string; name: string; price100g: number; price200g: number }
type ManualItem = { productId: string; size: '100g' | '200g'; quantity: number; price: number }
type ManualOrderForm = { orderNumber: string; createdAt: string; customerName: string; phone: string; email: string; address: string; shippingMethod: string; paymentMethod: string; status: string; items: ManualItem[]; shippingFee: number; notes: string }

const SHIPPING_FEE: Record<string, number> = { YAMATO: 100, SEVEN: 60, SELF: 0 }

function emptyManualOrder(): ManualOrderForm {
  return {
    orderNumber: '',
    createdAt: new Date().toISOString().slice(0, 16),
    customerName: '',
    phone: '',
    email: '',
    address: '',
    shippingMethod: 'YAMATO',
    paymentMethod: 'TRANSFER',
    status: 'CONFIRMED',
    items: [{ productId: '', size: '100g', quantity: 1, price: 0 }],
    shippingFee: 100,
    notes: '',
  }
}

const SHIPPING_LABELS: Record<string, string> = { YAMATO: '黑貓', SEVEN: '7-11', SELF: '自取' }
const PAYMENT_LABELS: Record<string, string> = { COD: '貨到付款', TRANSFER: '銀行轉帳' }

const inputStyle = { border: '1px solid var(--brown-light)', background: 'var(--bg)', color: 'var(--text)' }
const inputClass = "w-full px-3 py-2 text-sm outline-none"

export default function AdminPage() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'orders' | 'posts'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [orderFilter, setOrderFilter] = useState('ALL')
  const [showPostForm, setShowPostForm] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [postForm, setPostForm] = useState({ title: '', category: 'BEAN', excerpt: '', content: '', coverImage: '', isPublished: false })
  const [products, setProducts] = useState<Product[]>([])
  const [showManualOrderForm, setShowManualOrderForm] = useState(false)
  const [manualOrder, setManualOrder] = useState<ManualOrderForm>(emptyManualOrder())
  const [savingOrder, setSavingOrder] = useState(false)

  const headers = useCallback(() => ({ 'Content-Type': 'application/json', 'x-admin-pw': pw }), [pw])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [oRes, pRes, prodRes] = await Promise.all([
      fetch('/api/admin/orders', { headers: headers() }),
      fetch('/api/admin/posts', { headers: headers() }),
      fetch('/api/admin/products', { headers: headers() }),
    ])
    if (oRes.ok) { setOrders(await oRes.json()); setAuthed(true) } else { alert('密碼錯誤') }
    if (pRes.ok) setPosts(await pRes.json())
    if (prodRes.ok) setProducts(await prodRes.json())
    setLoading(false)
  }, [headers])

  // Compute totals
  const manualSubtotal = manualOrder.items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)
  const manualTotal = manualSubtotal + (Number(manualOrder.shippingFee) || 0)

  const updateManualItem = (idx: number, patch: Partial<ManualItem>) => {
    setManualOrder(o => {
      const items = [...o.items]
      items[idx] = { ...items[idx], ...patch }
      // auto-fill price when product/size changes
      if (patch.productId || patch.size) {
        const it = items[idx]
        const prod = products.find(p => p.id === it.productId)
        if (prod) {
          items[idx].price = it.size === '200g' ? prod.price200g : prod.price100g
        }
      }
      return { ...o, items }
    })
  }

  const addManualItem = () => setManualOrder(o => ({ ...o, items: [...o.items, { productId: '', size: '100g', quantity: 1, price: 0 }] }))
  const removeManualItem = (idx: number) => setManualOrder(o => ({ ...o, items: o.items.filter((_, i) => i !== idx) }))

  const setShippingMethod = (method: string) => {
    setManualOrder(o => ({ ...o, shippingMethod: method, shippingFee: SHIPPING_FEE[method] ?? o.shippingFee }))
  }

  const submitManualOrder = async () => {
    if (!manualOrder.customerName || !manualOrder.phone) return alert('請填寫姓名與電話')
    if (manualOrder.items.some(i => !i.productId)) return alert('每個品項都要選擇商品')
    setSavingOrder(true)
    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        ...manualOrder,
        subtotal: manualSubtotal,
        total: manualTotal,
        createdAt: manualOrder.createdAt ? new Date(manualOrder.createdAt).toISOString() : undefined,
      }),
    })
    setSavingOrder(false)
    if (res.ok) {
      const created = await res.json()
      setOrders(o => [created, ...o])
      setShowManualOrderForm(false)
      setManualOrder(emptyManualOrder())
    } else {
      const err = await res.json().catch(() => ({ error: '建立失敗' }))
      alert(err.error || '建立失敗')
    }
  }

  const openManualOrderForm = () => {
    setManualOrder(emptyManualOrder())
    setShowManualOrderForm(true)
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status }) })
    setOrders(o => o.map(order => order.id === id ? { ...order, status } : order))
  }

  const savePost = async () => {
    if (!postForm.title || !postForm.content) return alert('請填寫標題與內容')
    if (editPost) {
      const res = await fetch(`/api/admin/posts/${editPost.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(postForm) })
      if (res.ok) { const updated = await res.json(); setPosts(p => p.map(x => x.id === editPost.id ? updated : x)) }
    } else {
      const res = await fetch('/api/admin/posts', { method: 'POST', headers: headers(), body: JSON.stringify(postForm) })
      if (res.ok) { const created = await res.json(); setPosts(p => [created, ...p]) }
    }
    setShowPostForm(false); setEditPost(null)
    setPostForm({ title: '', category: 'BEAN', excerpt: '', content: '', coverImage: '', isPublished: false })
  }

  const togglePublish = async (post: Post) => {
    const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ isPublished: !post.isPublished }) })
    if (res.ok) { const updated = await res.json(); setPosts(p => p.map(x => x.id === post.id ? updated : x)) }
  }

  const deletePost = async (id: string) => {
    if (!confirm('確定刪除？')) return
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE', headers: headers() })
    setPosts(p => p.filter(x => x.id !== id))
  }

  const openEdit = (post: Post) => {
    setEditPost(post)
    setPostForm({ title: post.title, category: post.category, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage || '', isPublished: post.isPublished })
    setShowPostForm(true)
  }

  const filteredOrders = orderFilter === 'ALL' ? orders : orders.filter(o => o.status === orderFilter)

  if (!authed) return (
    <div className="max-w-sm mx-auto px-6 py-32">
      <h1 className="text-xl mb-8 text-center" style={{ color: 'var(--brown)' }}>後台管理</h1>
      <input type="password" placeholder="管理員密碼" value={pw} onChange={e => setPw(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && fetchAll()}
        className="w-full px-3 py-2 text-sm mb-4 outline-none" style={inputStyle} />
      <button onClick={fetchAll} disabled={loading} className="w-full py-2 text-sm tracking-widest hover:opacity-80" style={{ background: 'var(--brown)', color: 'white' }}>
        {loading ? '驗證中...' : '進入後台'}
      </button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Tabs */}
      <div className="flex gap-6 mb-10" style={{ borderBottom: '1px solid var(--cream)' }}>
        {(['orders', 'posts'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="pb-3 text-sm tracking-wide transition-colors"
            style={{ color: tab === t ? 'var(--brown)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--brown)' : '2px solid transparent' }}>
            {t === 'orders' ? '訂單管理' : '文章管理'}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl" style={{ color: 'var(--brown)' }}>訂單管理</h2>
            <div className="flex items-center gap-3">
              <button onClick={openManualOrderForm} className="px-4 py-2 text-xs tracking-widest hover:opacity-80" style={{ background: 'var(--brown)', color: 'white' }}>
                + 手動新增訂單
              </button>
              <button onClick={fetchAll} className="text-xs underline hover:opacity-70" style={{ color: 'var(--muted)' }}>重新整理</button>
            </div>
          </div>

          {/* Manual Order Form */}
          {showManualOrderForm && (
            <div className="mb-8 p-6 rounded-sm" style={{ background: 'var(--cream)', border: '1px solid var(--brown-light)' }}>
              <h3 className="text-base font-semibold mb-6" style={{ color: 'var(--brown)' }}>手動新增訂單</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>訂單編號（留空自動產生）</label>
                  <input placeholder="例：LC20260514ABCD" value={manualOrder.orderNumber} onChange={e => setManualOrder(o => ({ ...o, orderNumber: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>訂購日期</label>
                  <input type="datetime-local" value={manualOrder.createdAt} onChange={e => setManualOrder(o => ({ ...o, createdAt: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>姓名 *</label>
                  <input placeholder="客戶姓名" value={manualOrder.customerName} onChange={e => setManualOrder(o => ({ ...o, customerName: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>電話 *</label>
                  <input placeholder="0912345678" value={manualOrder.phone} onChange={e => setManualOrder(o => ({ ...o, phone: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>地址</label>
                  <input placeholder="收貨地址" value={manualOrder.address} onChange={e => setManualOrder(o => ({ ...o, address: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Email（選填）</label>
                  <input placeholder="email@example.com" value={manualOrder.email} onChange={e => setManualOrder(o => ({ ...o, email: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>運送方式</label>
                    <select value={manualOrder.shippingMethod} onChange={e => setShippingMethod(e.target.value)} className={inputClass} style={inputStyle}>
                      <option value="YAMATO">黑貓 (NT$100)</option>
                      <option value="SEVEN">7-11 (NT$60)</option>
                      <option value="SELF">自取 (免運)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>付款方式</label>
                    <select value={manualOrder.paymentMethod} onChange={e => setManualOrder(o => ({ ...o, paymentMethod: e.target.value }))} className={inputClass} style={inputStyle}>
                      <option value="TRANSFER">銀行轉帳</option>
                      <option value="COD">貨到付款</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>品項</label>
                <div className="space-y-2">
                  {manualOrder.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <select value={item.productId} onChange={e => updateManualItem(idx, { productId: e.target.value })} className="col-span-5 px-2 py-2 text-sm outline-none" style={inputStyle}>
                        <option value="">選擇商品</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <select value={item.size} onChange={e => updateManualItem(idx, { size: e.target.value as '100g' | '200g' })} className="col-span-2 px-2 py-2 text-sm outline-none" style={inputStyle}>
                        <option value="100g">100g</option>
                        <option value="200g">200g</option>
                      </select>
                      <input type="number" min="1" placeholder="數量" value={item.quantity} onChange={e => updateManualItem(idx, { quantity: Number(e.target.value) })} className="col-span-2 px-2 py-2 text-sm outline-none" style={inputStyle} />
                      <input type="number" min="0" placeholder="單價" value={item.price} onChange={e => updateManualItem(idx, { price: Number(e.target.value) })} className="col-span-2 px-2 py-2 text-sm outline-none" style={inputStyle} />
                      <button onClick={() => removeManualItem(idx)} disabled={manualOrder.items.length === 1} className="col-span-1 text-xs hover:opacity-70 disabled:opacity-30" style={{ color: '#C4A4A4' }}>移除</button>
                    </div>
                  ))}
                </div>
                <button onClick={addManualItem} className="mt-2 text-xs underline hover:opacity-70" style={{ color: 'var(--brown)' }}>+ 加一個品項</button>
              </div>

              {/* Totals */}
              <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 rounded-sm" style={{ background: 'var(--bg)' }}>
                <div className="text-sm" style={{ color: 'var(--text)' }}>
                  <span style={{ color: 'var(--muted)' }}>小計：</span>NT${manualSubtotal}
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>運費</label>
                  <input type="number" min="0" value={manualOrder.shippingFee} onChange={e => setManualOrder(o => ({ ...o, shippingFee: Number(e.target.value) }))} className={inputClass} style={inputStyle} />
                </div>
                <div className="text-base font-semibold flex items-end" style={{ color: 'var(--brown)' }}>
                  總計：NT${manualTotal}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>狀態</label>
                  <select value={manualOrder.status} onChange={e => setManualOrder(o => ({ ...o, status: e.target.value }))} className={inputClass} style={inputStyle}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>備註</label>
                  <input placeholder="選填" value={manualOrder.notes} onChange={e => setManualOrder(o => ({ ...o, notes: e.target.value }))} className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={submitManualOrder} disabled={savingOrder} className="px-6 py-2 text-sm tracking-widest hover:opacity-80 disabled:opacity-50" style={{ background: 'var(--brown)', color: 'white' }}>
                  {savingOrder ? '儲存中...' : '建立訂單'}
                </button>
                <button onClick={() => setShowManualOrderForm(false)} className="px-6 py-2 text-sm hover:opacity-70" style={{ color: 'var(--muted)' }}>取消</button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-6 flex-wrap">
            {['ALL', ...Object.keys(STATUS_LABELS)].map(s => (
              <button key={s} onClick={() => setOrderFilter(s)} className="px-3 py-1 text-xs transition-all"
                style={{ background: orderFilter === s ? 'var(--brown)' : 'transparent', color: orderFilter === s ? 'white' : 'var(--muted)', border: '1px solid var(--brown-light)' }}>
                {s === 'ALL' ? `全部 (${orders.length})` : `${STATUS_LABELS[s]} (${orders.filter(o => o.status === s).length})`}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-5 rounded-sm" style={{ background: 'var(--cream)', border: '1px solid #D4C4B0' }}>
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <span className="font-semibold text-sm" style={{ color: 'var(--brown)' }}>{order.orderNumber}</span>
                    <span className="text-xs ml-3" style={{ color: 'var(--muted)' }}>{new Date(order.createdAt).toLocaleString('zh-TW')}</span>
                  </div>
                  <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="text-xs px-2 py-1 outline-none cursor-pointer"
                    style={{ border: `1px solid ${STATUS_COLORS[order.status]}`, color: STATUS_COLORS[order.status], background: 'white' }}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1" style={{ color: 'var(--text)' }}>
                    <p><span style={{ color: 'var(--muted)' }}>客戶：</span>{order.customerName} · {order.phone}</p>
                    {order.email && <p><span style={{ color: 'var(--muted)' }}>Email：</span>{order.email}</p>}
                    <p><span style={{ color: 'var(--muted)' }}>運送：</span>{SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod}</p>
                    {order.address && <p><span style={{ color: 'var(--muted)' }}>地址：</span>{order.address}</p>}
                    <p><span style={{ color: 'var(--muted)' }}>付款：</span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
                  </div>
                  <div>
                    {order.items.map(item => (
                      <p key={item.id} className="text-xs" style={{ color: 'var(--text)' }}>{item.product.name} {item.size} × {item.quantity} — NT${item.price * item.quantity}</p>
                    ))}
                    <p className="text-sm font-semibold mt-2" style={{ color: 'var(--brown)' }}>合計 NT${order.total}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && <p className="text-center py-10 text-sm" style={{ color: 'var(--muted)' }}>沒有訂單</p>}
          </div>
        </>
      )}

      {/* Posts */}
      {tab === 'posts' && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl" style={{ color: 'var(--brown)' }}>文章管理</h2>
            <button onClick={() => { setEditPost(null); setPostForm({ title: '', category: 'BEAN', excerpt: '', content: '', coverImage: '', isPublished: false }); setShowPostForm(true) }}
              className="px-5 py-2 text-sm tracking-widest hover:opacity-80" style={{ background: 'var(--brown)', color: 'white' }}>
              + 新增文章
            </button>
          </div>

          {/* Post Form */}
          {showPostForm && (
            <div className="mb-10 p-6 rounded-sm" style={{ background: 'var(--cream)', border: '1px solid var(--brown-light)' }}>
              <h3 className="text-base font-semibold mb-6" style={{ color: 'var(--brown)' }}>{editPost ? '編輯文章' : '新增文章'}</h3>
              <div className="space-y-4">
                <input placeholder="標題" value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} className={inputClass} style={inputStyle} />
                <select value={postForm.category} onChange={e => setPostForm(f => ({ ...f, category: e.target.value }))} className={inputClass} style={inputStyle}>
                  <option value="BEAN">豆子介紹</option>
                  <option value="BREW">沖煮教學</option>
                </select>
                <input placeholder="摘要（列表頁顯示）" value={postForm.excerpt} onChange={e => setPostForm(f => ({ ...f, excerpt: e.target.value }))} className={inputClass} style={inputStyle} />
                <input placeholder="封面圖片路徑（選填，如 /images/xxx.jpg）" value={postForm.coverImage} onChange={e => setPostForm(f => ({ ...f, coverImage: e.target.value }))} className={inputClass} style={inputStyle} />
                <textarea placeholder="文章內容（按 Enter 換行）" value={postForm.content} onChange={e => setPostForm(f => ({ ...f, content: e.target.value }))}
                  rows={12} className={`${inputClass} resize-none`} style={inputStyle} />
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                  <input type="checkbox" checked={postForm.isPublished} onChange={e => setPostForm(f => ({ ...f, isPublished: e.target.checked }))} />
                  立即發佈
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={savePost} className="px-6 py-2 text-sm tracking-widest hover:opacity-80" style={{ background: 'var(--brown)', color: 'white' }}>儲存</button>
                <button onClick={() => { setShowPostForm(false); setEditPost(null) }} className="px-6 py-2 text-sm hover:opacity-70" style={{ color: 'var(--muted)' }}>取消</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-sm" style={{ background: 'var(--cream)', border: '1px solid #D4C4B0' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs px-2 py-0.5" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>{CATEGORY_LABELS[post.category]}</span>
                    <span className="text-xs" style={{ color: post.isPublished ? 'var(--sage)' : 'var(--muted)' }}>{post.isPublished ? '已發佈' : '草稿'}</span>
                  </div>
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--brown)' }}>{post.title}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <button onClick={() => togglePublish(post)} className="text-xs hover:opacity-70" style={{ color: 'var(--brown)' }}>
                    {post.isPublished ? '下架' : '發佈'}
                  </button>
                  <button onClick={() => openEdit(post)} className="text-xs hover:opacity-70" style={{ color: 'var(--brown)' }}>編輯</button>
                  <button onClick={() => deletePost(post.id)} className="text-xs hover:opacity-70" style={{ color: '#C4A4A4' }}>刪除</button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-center py-10 text-sm" style={{ color: 'var(--muted)' }}>還沒有文章</p>}
          </div>
        </>
      )}
    </div>
  )
}
