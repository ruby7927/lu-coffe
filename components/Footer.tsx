export default function Footer() {
  return (
    <footer style={{ background: 'var(--cream)', borderTop: '1px solid var(--brown-light)', color: 'var(--muted)' }}
      className="py-16 mt-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <img src="/images/lumee2.jpg" alt="嚕咖 Lu coffee" style={{ height: '100px', width: '100px', objectFit: 'contain', mixBlendMode: 'multiply', margin: '0 auto 16px' }} />
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
          嚕咪陪著我們，用一杯好咖啡，找回生活的節奏。
        </p>
        <a
          href="https://www.instagram.com/wonmiao_lucoffee?igsh=MWZ5d25pZTh5ZmVmeA%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm tracking-wider hover:opacity-70 transition-opacity mb-10"
          style={{ color: 'var(--brown)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
          </svg>
          @wonmiao_lucoffee
        </a>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          © 2025 嚕咖 Lu coffee · 台灣精品咖啡豆
          <span className="mx-2 opacity-40">|</span>
          <a href="/privacy" className="underline underline-offset-2 hover:opacity-70">
            服務條款與隱私權政策
          </a>
        </p>
      </div>
    </footer>
  )
}
