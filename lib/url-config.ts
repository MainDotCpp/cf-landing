import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

export type AnalyticsSnippet = {
  headHtml?: string
  bodyStartHtml?: string
  bodyEndHtml?: string
}

export type ResolvedUrlConfig = {
  pageInternal: string
  ctas?: Record<'primary' | 'secondary', string | undefined>
  analyticsSnippet?: AnalyticsSnippet
}

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').toLowerCase().trim()
}

export function normalizePath(pathname: string | null | undefined): string {
  const raw = (pathname ?? '/').trim()
  if (!raw || raw === '/') return '/'
  const stripped = raw.replace(/\/+$/, '')
  return stripped.length === 0 ? '/' : stripped
}

export async function getNormalizedHostAndPath(customPath?: string): Promise<{ host: string; path: string }> {
  const h = await headers()
  const host = normalizeHost(h.get('x-forwarded-host') ?? h.get('host'))
  
  if (customPath) {
    return { host, path: normalizePath(customPath) }
  }
  
  // Build a URL from headers; query/hash are ignored by design
  const proto = (h.get('x-forwarded-proto') ?? 'https').split(',')[0]
  const nextUrl = h.get('x-invoke-path') ?? h.get('x-original-url') ?? h.get('x-rewrite-url') ?? '/'
  const url = new URL(`${proto}://${host}${nextUrl}`)
  const path = normalizePath(url.pathname)
  return { host, path }
}

export async function queryUrlConfig(host: string, path: string): Promise<ResolvedUrlConfig | null> {
  const row = await prisma.urlConfig.findUnique({
    where: { host_path: { host, path } },
  }).catch(() => null)
  if (!row) return null
  return {
    pageInternal: row.pageInternal,
    ctas: (row.ctas as any) ?? undefined,
    analyticsSnippet: (row.analyticsSnippet as any) ?? undefined,
  }
}

export async function getCachedUrlConfig(customPath?: string): Promise<ResolvedUrlConfig | null> {
  const { host, path } = await getNormalizedHostAndPath(customPath)
  if (!host) return null
  
  let config = await queryUrlConfig(host, path)
  
  // 如果配置不存在，创建一个默认配置
  if (!config) {
    try {
      const newConfig = await prisma.urlConfig.create({
        data: {
          host,
          path,
          pageInternal: '/', // 默认显示首页
          ctas: JSON.stringify({
            primary: '#',
            secondary: '#',
          }),
          analyticsSnippet: JSON.stringify({
            headHtml: '',
            bodyStartHtml: '',
            bodyEndHtml: '',
          }),
        },
      })
      
      config = {
        pageInternal: newConfig.pageInternal,
        ctas: (newConfig.ctas as any) ?? undefined,
        analyticsSnippet: (newConfig.analyticsSnippet as any) ?? undefined,
      }
    } catch (error) {
      console.error('Error creating default config:', error)
      // 如果创建失败，返回一个默认配置对象
      return {
        pageInternal: '/',
        ctas: { primary: '#', secondary: '#' },
        analyticsSnippet: { headHtml: '', bodyStartHtml: '', bodyEndHtml: '' },
      }
    }
  }
  
  return config
}


