import type { NextRequest } from 'next/server'
import type { SupportedLanguage } from '@/lib/language'

import { NextResponse } from 'next/server'
import { getLanguageFromHeaders, isLanguageMatch, normalizeLanguage } from '@/lib/language'

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
  const allowedLanguages = Array.isArray(rule) ? rule.join(',') : 'all'

  // 如果允许所有语言，直接放行并设置 header
  if (rule === 'all') {
    const response = NextResponse.next()
    response.headers.set('x-language-blocked', 'false')
    response.headers.set('x-allowed-languages', allowedLanguages)
    return response
  }

  // 如果语言不匹配，重定向到首页并标记为阻塞
  if (!isMatch) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    const response = NextResponse.rewrite(url)
    response.headers.set('x-language-blocked', 'true')
    response.headers.set('x-allowed-languages', allowedLanguages)
    response.headers.set('x-original-path', path)
    return response
  }

  // 语言匹配，允许访问
  const response = NextResponse.next()
  response.headers.set('x-language-blocked', 'false')
  response.headers.set('x-allowed-languages', allowedLanguages)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
