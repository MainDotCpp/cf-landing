import type { NextRequest } from 'next/server'
import type { SupportedLanguage } from '@/lib/language'

import { NextResponse } from 'next/server'
import { getLanguageFromHeaders, isLanguageMatch, normalizeLanguage } from '@/lib/language'
import { requestLogger } from '@/lib/request-logger'

// ========================================
// 🌐 全局语言配置
// ========================================
// 简化配置：除首页外，所有路径使用统一的语言规则
// ========================================

const LANGUAGE_CONFIG = {
  // 首页的语言规则
  homePage: 'all' as SupportedLanguage[] | 'all',

  // 除首页外，所有其他路径的语言规则
  // 'all' = 允许所有语言
  // ['ja'] = 仅日语
  // ['ja', 'en'] = 日语和英语
  // ['ja', 'zh', 'ko'] = 日语、中文、韩语
  otherPages: 'all' as SupportedLanguage[] | 'all',
}

// ========================================
// 🔧 高级配置（可选）
// ========================================
// 如果需要为特定路径单独配置，可以在这里添加
// 这些规则会覆盖上面的 otherPages 配置
const SPECIAL_RULES: Record<string, SupportedLanguage[] | 'all'> = {
  // 示例：
  // '/special-path': ['ja', 'en'],
  // '/vip-page': ['ja'],
}

// ========================================
// 🔧 系统配置
// ========================================
const CONFIG = {
  // 是否启用语言过滤
  enabled: true, // 设为 false 可禁用语言过滤

  // 是否在响应头中添加调试信息（开发环境）
  debug: true, // 生产环境建议设为 false

  // 是否记录请求日志
  logging: true, // 记录所有请求和拦截情况
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过静态资源、API 路由、配置页面
  if (
    pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname.includes('.')
    || pathname.includes('config=1')
  ) {
    return NextResponse.next()
  }

  // 如果功能未启用，直接通过
  if (!CONFIG.enabled) {
    return NextResponse.next()
  }

  // 获取用户语言
  const acceptLanguage = request.headers.get('accept-language')
  const userLang = normalizeLanguage(getLanguageFromHeaders(acceptLanguage))

  // 获取该路径的语言规则
  const path = pathname === '' ? '/' : pathname

  // 确定当前路径的语言规则
  let rule: SupportedLanguage[] | 'all'

  // 1. 首先检查是否有特殊规则
  if (path in SPECIAL_RULES) {
    rule = SPECIAL_RULES[path]
  }
  // 2. 首页使用 homePage 规则
  else if (path === '/') {
    rule = LANGUAGE_CONFIG.homePage
  }
  // 3. 其他所有路径使用 otherPages 规则
  else {
    rule = LANGUAGE_CONFIG.otherPages
  }

  // 检查语言是否匹配
  const isMatch = rule === 'all' || isLanguageMatch(userLang, rule)

  // 记录请求日志
  if (CONFIG.logging) {
    requestLogger.log({
      timestamp: new Date().toISOString(),
      path,
      userLanguage: userLang,
      allowedLanguages: Array.isArray(rule) ? rule.join(',') : 'all',
      isBlocked: !isMatch,
      userAgent: request.headers.get('user-agent') || undefined,
      referer: request.headers.get('referer') || undefined,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
    })
  }

  // 如果规则是 'all'，允许所有语言
  if (rule === 'all') {
    return NextResponse.next()
  }

  // 如果语言不匹配，内部 rewrite 到首页
  if (!isMatch) {
    const url = request.nextUrl.clone()
    url.pathname = '/'

    const response = NextResponse.rewrite(url)

    // 添加调试信息（仅开发环境）
    if (CONFIG.debug) {
      response.headers.set('x-language-mismatch', 'true')
      response.headers.set('x-user-language', userLang)
      response.headers.set('x-allowed-languages', rule.join(','))
      response.headers.set('x-original-path', path)
    }

    return response
  }

  return NextResponse.next()
}

// 配置中间件匹配路径
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
