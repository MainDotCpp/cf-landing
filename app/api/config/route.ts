import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNormalizedHostAndPath, queryUrlConfig } from '@/lib/url-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customPath = searchParams.get('path') || undefined
    const { host, path } = await getNormalizedHostAndPath(customPath)

    if (!host) {
      return NextResponse.json(
        { error: 'Unable to determine host' },
        { status: 400 },
      )
    }

    const config = await queryUrlConfig(host, path)

    // 如果配置不存在，返回默认空配置（不写入数据库）
    if (!config) {
      return NextResponse.json({
        host,
        path,
        pageInternal: '/',
        ctas: {
          primary: '#',
          secondary: '#',
        },
        analyticsSnippet: {
          headHtml: '',
          bodyStartHtml: '',
          bodyEndHtml: '',
        },
      })
    }

    return NextResponse.json({
      host,
      path,
      ...config,
    })
  }
  catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customPath = searchParams.get('path') || undefined
    const { host, path } = await getNormalizedHostAndPath(customPath)

    if (!host) {
      return NextResponse.json(
        { error: 'Unable to determine host' },
        { status: 400 },
      )
    }

    const body = await request.json() as {
      pageInternal: string
      ctas: Record<string, string>
      analyticsSnippet: Record<string, string>
    }
    const { pageInternal, ctas, analyticsSnippet } = body

    // 使用 upsert：如果配置不存在则创建，否则更新
    const updatedConfig = await prisma.urlConfig.upsert({
      where: {
        host_path: {
          host,
          path,
        },
      },
      update: {
        pageInternal,
        ctas: JSON.stringify(ctas),
        analyticsSnippet: JSON.stringify(analyticsSnippet),
      },
      create: {
        host,
        path,
        pageInternal,
        ctas: JSON.stringify(ctas),
        analyticsSnippet: JSON.stringify(analyticsSnippet),
      },
    })

    // 返回格式化的配置
    const response = {
      host: updatedConfig.host,
      path: updatedConfig.path,
      pageInternal: updatedConfig.pageInternal,
      ctas: typeof updatedConfig.ctas === 'string'
        ? JSON.parse(updatedConfig.ctas)
        : updatedConfig.ctas,
      analyticsSnippet: typeof updatedConfig.analyticsSnippet === 'string'
        ? JSON.parse(updatedConfig.analyticsSnippet)
        : updatedConfig.analyticsSnippet,
    }

    return NextResponse.json(response)
  }
  catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 },
    )
  }
}
