import type { PageInfo, UrlConfig } from '@/types/config'

/**
 * 获取当前路径的配置
 */
export async function fetchConfig(path: string): Promise<UrlConfig> {
  const response = await fetch(`/api/config?path=${encodeURIComponent(path)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch config')
  }
  return response.json()
}

/**
 * 保存配置
 */
export async function saveConfig(path: string, data: Partial<UrlConfig>): Promise<UrlConfig> {
  const response = await fetch(`/api/config?path=${encodeURIComponent(path)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to save config')
  }

  return response.json()
}

/**
 * 获取所有可用页面
 */
export async function fetchAvailablePages(): Promise<PageInfo[]> {
  const response = await fetch('/api/pages')
  if (!response.ok) {
    throw new Error('Failed to fetch pages')
  }
  return response.json()
}

