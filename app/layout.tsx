import type { Metadata } from 'next'
import type React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { Noto_Sans_JP } from 'next/font/google'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import ConfigProvider from '@/components/ConfigProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { logPageView } from '@/lib/server-logger'
import { getCachedUrlConfig } from '@/lib/url-config'
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

  // 获取 URL 配置
  const config = await getCachedUrlConfig()

  // 如果配置不存在，提供默认配置
  const defaultConfig = config || {
    pageInternal: '/',
    ctas: { primary: '#', secondary: '#' },
    analyticsSnippet: { headHtml: '', bodyStartHtml: '', bodyEndHtml: '' },
  }

  return (
    <html lang="ja">
      <head>
        {/* 注入 head 分析代码 */}
        {defaultConfig.analyticsSnippet?.headHtml
          ? (
              <script dangerouslySetInnerHTML={{ __html: defaultConfig.analyticsSnippet.headHtml }} />
            )
          : null}
      </head>
      <body className={`font-sans ${notoSansJP.variable} ${GeistMono.variable}`}>
        {/* 注入 body start 分析代码 */}
        {defaultConfig.analyticsSnippet?.bodyStartHtml
          ? (
              <div dangerouslySetInnerHTML={{ __html: defaultConfig.analyticsSnippet.bodyStartHtml }} />
            )
          : null}

        <ConfigProvider config={defaultConfig}>
          <QueryProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster position="top-center" richColors />
            <Analytics />
          </QueryProvider>
        </ConfigProvider>

        {/* 注入 body end 分析代码 */}
        {defaultConfig.analyticsSnippet?.bodyEndHtml
          ? (
              <div dangerouslySetInnerHTML={{ __html: defaultConfig.analyticsSnippet.bodyEndHtml }} />
            )
          : null}
      </body>
    </html>
  )
}
