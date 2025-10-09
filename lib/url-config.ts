import { headers } from 'next/headers'
import { prisma } from './prisma'

export interface AnalyticsSnippet {
  headHtml?: string
  bodyStartHtml?: string
  bodyEndHtml?: string
}

export interface ResolvedUrlConfig {
  pageInternal: string
  ctas?: Record<'primary' | 'secondary', string | undefined>
  analyticsSnippet?: AnalyticsSnippet
}

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').toLowerCase().trim()
}

export function normalizePath(pathname: string | null | undefined): string {
  const raw = (pathname ?? '/').trim()
  if (!raw || raw === '/')
    return '/'
  const stripped = raw.replace(/\/+$/, '')
  return stripped.length === 0 ? '/' : stripped
}

export async function getNormalizedHostAndPath(customPath?: string): Promise<{ host: string, path: string }> {
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
  // 1. 先尝试精确匹配
  let row = await prisma.urlConfig.findUnique({
    where: { host_path: { host, path } },
  }).catch(() => null)

  // 2. 如果没找到，尝试匹配通配符 host (*)
  if (!row) {
    row = await prisma.urlConfig.findUnique({
      where: { host_path: { host: '*', path } },
    }).catch(() => null)
  }

  // 3. 如果还没找到，尝试只用 path 查询（忽略 host）
  if (!row) {
    row = await prisma.urlConfig.findFirst({
      where: { path },
      orderBy: { updatedAt: 'desc' }, // 最近更新的优先
    }).catch(() => null)
  }

  if (!row)
    return null

  return {
    pageInternal: row.pageInternal,
    ctas: (row.ctas as any) ?? undefined,
    analyticsSnippet: (row.analyticsSnippet as any) ?? undefined,
  }
}

export async function getCachedUrlConfig(customPath?: string): Promise<ResolvedUrlConfig | null> {
  const { host, path } = await getNormalizedHostAndPath(customPath)
  if (!host)
    return null

  const config = await queryUrlConfig(host, path)

  // 如果配置不存在，返回 null（不自动创建）
  return config
}
