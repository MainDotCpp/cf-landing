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
  // 记录页面访问（使用 React cache 自动去重）
  const headersList = await headers()
  const requestId = headersList.get('x-request-id') || `fallback-${Date.now()}`

  // 调用 cached 函数（同一 requestId 只会执行一次）
  // 不使用 Promise 包装，直接调用以确保执行
  logPageView(requestId).catch((error) => {
    // 静默处理错误，不影响页面渲染
    console.error('Log page view error:', error)
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
