import type { Metadata } from 'next'
import type React from 'react'
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

  // 如果配置不存在，提供默认配置而不是 404
  const defaultConfig = config || {
    pageInternal: '/',
    ctas: { primary: '#', secondary: '#' },
    analyticsSnippet: { headHtml: '', bodyStartHtml: '', bodyEndHtml: '' },
  }

  return (
    <>
      {/* bodyStartHtml 注入由此层负责（head 片段在 app/(pages)/head.tsx） */}
      {defaultConfig.analyticsSnippet?.bodyStartHtml
        ? (
            <div dangerouslySetInnerHTML={{ __html: defaultConfig.analyticsSnippet.bodyStartHtml }} />
          )
        : null}
      <ConfigProvider config={defaultConfig}>
        <Suspense fallback={null}>{children}</Suspense>
      </ConfigProvider>
      {defaultConfig.analyticsSnippet?.bodyEndHtml
        ? (
            <div dangerouslySetInnerHTML={{ __html: defaultConfig.analyticsSnippet.bodyEndHtml }} />
          )
        : null}
    </>
  )
}
