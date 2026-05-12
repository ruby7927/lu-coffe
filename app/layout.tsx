import type { Metadata } from 'next'
import { Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '嚕咖 Lu coffee｜精品咖啡豆',
  description: '台灣精品咖啡豆專門店。嚕咪陪著我們，用一杯好咖啡，找回生活的節奏。手沖咖啡豆、淺焙咖啡豆、台灣咖啡豆推薦。',
  keywords: ['台灣咖啡豆', '淺焙咖啡豆', '手沖咖啡豆推薦', '精品咖啡豆', '嚕咖'],
  openGraph: {
    title: '嚕咖 Lu coffee｜精品咖啡豆',
    description: '嚕咪陪著我們，用一杯好咖啡，找回生活的節奏。',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={notoSerifTC.className}>
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
