import type { Metadata } from 'next'
import type React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { Noto_Sans_JP } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: '株式投資アカデミー | 初心者から上級者まで',
  description: '株式投資の基礎から応用まで、プロの分析と教育コンテンツを提供',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans ${notoSansJP.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
