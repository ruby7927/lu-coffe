import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '服務條款與隱私權政策｜嚕咖 Lu coffee',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: 'var(--brown-light)' }}>LEGAL</p>
        <h1 className="text-3xl" style={{ color: 'var(--brown)' }}>服務條款與隱私權政策</h1>
        <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>最後更新：2025 年 5 月</p>
      </div>

      <div className="space-y-12 text-sm leading-loose" style={{ color: 'var(--text)' }}>

        {/* Terms of Service */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--brown)' }}>一、服務條款</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 商品說明</h3>
              <p>嚕咖 Lu coffee 販售精品咖啡生豆及熟豆。所有商品皆由專業烘豆師代工烘焙，並於黃金賞味期內出貨。商品圖片及描述僅供參考，實際風味因沖煮方式而異。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. 訂購與付款</h3>
              <p>訂單成立後，我們將盡快與您確認。目前提供以下付款方式：</p>
              <ul className="list-disc list-inside mt-2 space-y-1" style={{ color: 'var(--muted)' }}>
                <li>銀行轉帳：請於訂單成立後 3 日內完成匯款，逾期訂單將自動取消。</li>
                <li>貨到付款：收到包裹時以現金支付。</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 運送說明</h3>
              <p>提供黑貓宅急便、7-11 取貨及自取三種方式。訂單確認後約 3–5 個工作天出貨。出貨後將以簡訊或 Instagram 私訊通知。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. 退換貨政策</h3>
              <p>依消費者保護法，商品到貨後 7 日內享有猶豫期（鑑賞期）。若商品有瑕疵或運送損壞，請於收到後 48 小時內透過 Instagram 私訊聯繫，我們將盡快為您處理。</p>
              <p className="mt-2" style={{ color: 'var(--muted)' }}>注意：咖啡豆屬食品類商品，已拆封或開封者恕不接受退換。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. 免責聲明</h3>
              <p>嚕咖 Lu coffee 保留修改商品內容、價格及服務條款的權利，修改後將公告於網站上。</p>
            </div>
          </div>
        </section>

        <div style={{ borderTop: '1px solid var(--cream)' }} />

        {/* Privacy Policy */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--brown)' }}>二、隱私權政策</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 個人資料蒐集</h3>
              <p>當您訂購商品時，我們會蒐集以下資料：姓名、手機號碼、電子郵件（選填）、收件地址。這些資料僅用於處理訂單及聯繫。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. 資料使用目的</h3>
              <p>蒐集的個人資料用於：訂單處理與出貨通知、客服聯繫、改善服務品質。我們不會將您的個人資料出售或提供給第三方，除非法律要求。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 資料保護</h3>
              <p>我們採取合理的技術措施保護您的個人資料，防止未經授權的存取、揭露或濫用。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. 您的權利</h3>
              <p>您有權查詢、更正或要求刪除您的個人資料。如需行使上述權利，請透過 Instagram 私訊 @wonmiao_lucoffee 聯繫我們。</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. Cookie</h3>
              <p>本網站使用 Cookie 以維持購物車狀態，不用於追蹤個人行為或廣告目的。</p>
            </div>
          </div>
        </section>

        <div className="pt-4 text-xs" style={{ color: 'var(--muted)' }}>
          如有任何疑問，歡迎透過 Instagram 私訊聯繫：
          <a href="https://www.instagram.com/wonmiao_lucoffee" target="_blank" rel="noopener noreferrer"
            className="ml-1 underline underline-offset-2 hover:opacity-70" style={{ color: 'var(--brown)' }}>
            @wonmiao_lucoffee
          </a>
        </div>
      </div>
    </div>
  )
}
