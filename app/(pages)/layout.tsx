import type { Metadata } from 'next'
import type React from 'react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ConfigProvider from '@/components/ConfigProvider'
import { getCachedUrlConfig } from '@/lib/url-config'

export const metadata: Metadata = {
  title: '株式投資アカデミー | 初心者から上級者まで',
  description: '株式投資の基礎から応用まで、プロの分析と教育コンテンツを提供',
}

export default async function JPLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const config = await getCachedUrlConfig()
  if (!config) {
    notFound()
  }

  return (
    <>
      {/* bodyStartHtml 注入由此层负责（head 片段在 app/(pages)/head.tsx） */}
      {config?.analyticsSnippet?.bodyStartHtml
        ? (
            <div dangerouslySetInnerHTML={{ __html: config.analyticsSnippet.bodyStartHtml }} />
          )
        : null}
      <ConfigProvider config={config}>
        <Suspense fallback={null}>{children}</Suspense>
      </ConfigProvider>
      {config?.analyticsSnippet?.bodyEndHtml
        ? (
            <div dangerouslySetInnerHTML={{ __html: config.analyticsSnippet.bodyEndHtml }} />
          )
        : null}
    </>
  )
}
