import type { NextRequest } from 'next/server'
import type { SupportedLanguage } from '@/lib/language'

import { NextResponse } from 'next/server'
import { getLanguageFromHeaders, isLanguageMatch, normalizeLanguage } from '@/lib/language'
import { requestLogger } from '@/lib/request-logger'

// 语言配置
const LANGUAGE_CONFIG = {
  homePage: 'all' as SupportedLanguage[] | 'all',
  otherPages: ['ja', 'ja-jp'] as SupportedLanguage[] | 'all',
}

// 特殊路径规则（覆盖 otherPages）
const SPECIAL_RULES: Record<string, SupportedLanguage[] | 'all'> = {
  '/contact': 'all',
  '/legal': 'all',
  '/privacy': 'all',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过静态资源、API 路由、配置页面、日志页面
  if (
    pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname.includes('.')
    || pathname.includes('config=1')
    || pathname.startsWith('/logs')
  ) {
    return NextResponse.next()
  }

  const acceptLanguage = request.headers.get('accept-language')
  const userLang = normalizeLanguage(getLanguageFromHeaders(acceptLanguage))
  const path = pathname === '' ? '/' : pathname

  // 确定语言规则
  let rule: SupportedLanguage[] | 'all'
  if (path in SPECIAL_RULES) {
    rule = SPECIAL_RULES[path]
  }
  else if (path === '/') {
    rule = LANGUAGE_CONFIG.homePage
  }
  else {
    rule = LANGUAGE_CONFIG.otherPages
  }

    const isMatch = rule === 'all' || isLanguageMatch(userLang, rule)

    const logData = {
      timestamp: new Date().toISOString(),
      path,
      userLanguage: userLang,
      allowedLanguages: Array.isArray(rule) ? rule.join(',') : 'all',
      isBlocked: !isMatch,
      userAgent: request.headers.get('user-agent') || undefined,
      referer: request.headers.get('referer') || undefined,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
    }

    // 记录到内存
    requestLogger.log(logData)

    // 异步持久化到文件（不阻塞响应）
    fetch(`${request.nextUrl.origin}/api/log-persist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    }).catch(() => {}) // 忽略错误，避免影响主流程

  if (rule === 'all') {
    return NextResponse.next()
  }

  if (!isMatch) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
