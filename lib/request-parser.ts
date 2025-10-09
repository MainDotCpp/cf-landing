/**
 * 请求信息解析工具
 * 用于从 User-Agent、URL 等提取有用信息
 */

export interface DeviceInfo {
  deviceType: string // mobile/desktop/tablet/bot
  browser: string
  browserVersion: string
  os: string
  osVersion: string
}

export interface UtmParams {
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
}

/**
 * 解析 User-Agent 获取设备、浏览器、系统信息
 */
export function parseUserAgent(userAgent: string | null): DeviceInfo {
  if (!userAgent) {
    return {
      deviceType: 'unknown',
      browser: 'unknown',
      browserVersion: 'unknown',
      os: 'unknown',
      osVersion: 'unknown',
    }
  }

  const ua = userAgent.toLowerCase()

  // 检测设备类型
  let deviceType = 'desktop'
  if (/bot|crawler|spider|crawling/i.test(userAgent)) {
    deviceType = 'bot'
  }
  else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet'
  }
  else if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile'
  }

  // 检测浏览器
  let browser = 'unknown'
  let browserVersion = 'unknown'

  if (ua.includes('edg/')) {
    browser = 'Edge'
    const match = ua.match(/edg\/([0-9.]+)/)
    browserVersion = match ? match[1] : 'unknown'
  }
  else if (ua.includes('chrome/') && !ua.includes('edg')) {
    browser = 'Chrome'
    const match = ua.match(/chrome\/([0-9.]+)/)
    browserVersion = match ? match[1] : 'unknown'
  }
  else if (ua.includes('firefox/')) {
    browser = 'Firefox'
    const match = ua.match(/firefox\/([0-9.]+)/)
    browserVersion = match ? match[1] : 'unknown'
  }
  else if (ua.includes('safari/') && !ua.includes('chrome')) {
    browser = 'Safari'
    const match = ua.match(/version\/([0-9.]+)/)
    browserVersion = match ? match[1] : 'unknown'
  }
  else if (ua.includes('googlebot')) {
    browser = 'Googlebot'
    const match = ua.match(/googlebot\/([0-9.]+)/)
    browserVersion = match ? match[1] : 'unknown'
  }

  // 检测操作系统（注意：iPhone UA 也包含 "Mac OS X"，所以要先检测 iOS）
  let os = 'unknown'
  let osVersion = 'unknown'

  if (ua.includes('iphone') || ua.includes('ipad')) {
    // iOS 设备（必须先检测，因为 UA 中也包含 "Mac OS X"）
    os = 'iOS'
    const match = ua.match(/os ([0-9_]+)/)
    osVersion = match ? match[1].replace(/_/g, '.') : 'unknown'
  }
  else if (ua.includes('android')) {
    os = 'Android'
    const match = ua.match(/android ([0-9.]+)/)
    osVersion = match ? match[1] : 'unknown'
  }
  else if (ua.includes('windows nt')) {
    os = 'Windows'
    const match = ua.match(/windows nt ([0-9.]+)/)
    if (match) {
      const version = match[1]
      // Windows 版本映射
      const versionMap: Record<string, string> = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
      }
      osVersion = versionMap[version] || version
    }
  }
  else if (ua.includes('mac os x')) {
    os = 'macOS'
    const match = ua.match(/mac os x ([0-9_]+)/)
    osVersion = match ? match[1].replace(/_/g, '.') : 'unknown'
  }
  else if (ua.includes('linux')) {
    os = 'Linux'
  }

  return {
    deviceType,
    browser,
    browserVersion,
    os,
    osVersion,
  }
}

/**
 * 从 URL 提取 UTM 参数
 */
export function extractUtmParams(url: string | null): UtmParams {
  if (!url) {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    }
  }

  try {
    const urlObj = new URL(url)
    return {
      utmSource: urlObj.searchParams.get('utm_source'),
      utmMedium: urlObj.searchParams.get('utm_medium'),
      utmCampaign: urlObj.searchParams.get('utm_campaign'),
      utmTerm: urlObj.searchParams.get('utm_term'),
      utmContent: urlObj.searchParams.get('utm_content'),
    }
  }
  catch {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    }
  }
}

/**
 * 提取查询参数为 JSON 字符串
 */
export function extractQueryParams(url: string | null): string | null {
  if (!url)
    return null

  try {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })

    return Object.keys(params).length > 0 ? JSON.stringify(params) : null
  }
  catch {
    return null
  }
}

/**
 * 生成或获取会话 ID
 * 简单实现：基于 IP + User-Agent 的哈希
 */
export function generateSessionId(ip: string | null, userAgent: string | null): string {
  if (!ip && !userAgent)
    return 'unknown'

  const input = `${ip || 'noip'}-${userAgent || 'noua'}`

  // 简单哈希函数
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36)
}

