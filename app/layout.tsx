import type { Metadata } from 'next'
import type React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { Noto_Sans_JP } from 'next/font/google'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { logPageView } from '@/lib/server-logger'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 记录页面访问（异步执行，不阻塞渲染）
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-original-url') || '/'
  const isBlocked = headersList.get('x-language-blocked') === 'true'
  const allowedLanguages = headersList.get('x-allowed-languages') || 'all'
  const originalPath = headersList.get('x-original-path') || pathname

  // 使用 Promise 异步记录，不等待完成
  Promise.resolve().then(() => {
    logPageView(originalPath, isBlocked, allowedLanguages)
  })

  return (
    <html lang="ja">
      <body className={`font-sans ${notoSansJP.variable} ${GeistMono.variable}`}>
        <QueryProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster position="top-center" richColors />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  )
}
