'use client'

import { useConfig } from '@/components/ConfigProvider'
import { trackCtaClick } from '@/lib/analytics'

/**
 * 获取 CTA 链接
 */
export function useCtaLink(key: 'primary' | 'secondary', fallback?: string): string {
  const cfg = useConfig()
  const url = cfg?.ctas?.[key]
  return url ?? (fallback ?? '#')
}

/**
 * 获取 CTA 处理函数（包含跳转和跟踪）
 */
export function useCtaHandler(
  key: 'primary' | 'secondary',
  options?: {
    fallback?: string
    label?: string
    openInNewTab?: boolean
    onBeforeNavigate?: () => void
  },
) {
  const url = useCtaLink(key, options?.fallback)

  return () => {
    // 上报谷歌分析
    trackCtaClick(key, url, options?.label)

    // 执行自定义回调
    options?.onBeforeNavigate?.()

    // 如果是 # 或空，不执行跳转
    if (!url || url === '#') {
      console.warn(`[CTA] Invalid URL for ${key}:`, url)
      return
    }

    // 执行跳转
    if (options?.openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    else {
      window.location.href = url
    }
  }
}
