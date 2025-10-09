import ConfigPage from '@/app/(pages)/(common)/config/ConfigPage'

// 导入默认首页组件
import { EducationSection } from '@/components/education-section'
import { FeaturesSection } from '@/components/features-section'
import { Header } from '@/components/header'
import { Footer as HomeFooter } from '@/components/home-footer'
import { HeroSection } from '@/components/home-hero-section'
import { MarketAnalysisSection } from '@/components/market-analysis-section'

import { getCachedUrlConfig } from '@/lib/url-config'

interface PageProps {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 动态导入函数 - 根据 pageInternal 渲染内容
async function renderPageContent(pageInternal: string) {
  // 如果是根路径，渲染默认首页
  if (pageInternal === '/') {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <EducationSection />
          <MarketAnalysisSection />
          <FeaturesSection />
        </main>
        <HomeFooter />
      </div>
    )
  }

  // 移除开头的斜杠
  const pagePath = pageInternal.startsWith('/') ? pageInternal.slice(1) : pageInternal

  // 尝试动态导入页面
  try {
    // 首先尝试从 app 目录加载
    try {
      const { default: PageComponent } = await import(`@/app/${pagePath}/page`)
      return <PageComponent />
    }
    catch {
      // 如果失败，尝试从 app/(pages)/(jp) 目录加载
      try {
        const { default: PageComponent } = await import(`@/app/(pages)/(jp)/${pagePath}/page`)
        return <PageComponent />
      }
      catch {
        // 如果都失败了，返回一个错误提示
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-md p-8">
              <h1 className="text-2xl font-bold text-slate-800 mb-4">页面未找到</h1>
              <p className="text-slate-600 mb-4">
                无法加载页面:
                {' '}
                <code className="bg-slate-200 px-2 py-1 rounded">{pageInternal}</code>
              </p>
              <p className="text-sm text-slate-500">
                请确保该页面存在于以下位置之一：
              </p>
              <ul className="text-sm text-slate-500 mt-2 text-left">
                <li>
                  •
                  <code>
                    /app/
                    {pagePath}
                    /page.tsx
                  </code>
                </li>
                <li>
                  •
                  <code>
                    /app/(pages)/(jp)/
                    {pagePath}
                    /page.tsx
                  </code>
                </li>
              </ul>
            </div>
          </div>
        )
      }
    }
  }
  catch (error) {
    console.error('Error loading page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">加载错误</h1>
          <p className="text-slate-600">
            加载页面时出错:
            {' '}
            {error instanceof Error ? error.message : '未知错误'}
          </p>
        </div>
      </div>
    )
  }
}

export default async function CatchAllPage({ params, searchParams }: PageProps) {
  const slugParams = await params
  const queryParams = await searchParams

  // 构建完整路径
  const fullPath = `/${slugParams.slug?.join('/') || ''}`

  // 如果查询参数包含 config=1，显示配置页面
  if (queryParams.config === '1') {
    return <ConfigPage />
  }

  const config = await getCachedUrlConfig(fullPath)

  // 根据 pageInternal 渲染不同的页面内容
  const pageInternal = config?.pageInternal || '/'

  return await renderPageContent(pageInternal)
}
