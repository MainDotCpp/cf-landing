/**
 * Middleware: Google 访问屏蔽
 * 检测并屏蔽所有 Google bot 和爬虫访问
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isGoogleBot, shouldBlockGoogle } from '@/lib/google-detector'
import { getRealIP } from '@/lib/ip-utils'

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

  // 生成唯一请求 ID（用于防止重复记录）
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`

  // 获取访问者信息
  const ip = getRealIP(request.headers)
  const userAgent = request.headers.get('user-agent') || ''

  // 提取请求信息
  // 获取真实 host（优先使用代理传递的 host）
  const realHost = request.headers.get('x-forwarded-host')
    || request.headers.get('host')
    || request.nextUrl.host

  const method = request.method
  const protocol = request.nextUrl.protocol.replace(':', '')

  // 构建完整 URL（使用真实 host）
  const fullUrl = `${protocol}://${realHost}${pathname}${request.nextUrl.search}`

  // 检测是否为 Google bot
  const googleCheck = isGoogleBot(ip, userAgent)
  const shouldBlock = shouldBlockGoogle(googleCheck)

  // 如果需要屏蔽，重定向到首页
  if (shouldBlock) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = '/'

    const response = NextResponse.rewrite(rewriteUrl)
    response.headers.set('x-blocked', 'true')
    response.headers.set('x-blocked-reason', 'google-bot')
    response.headers.set('x-is-google-bot', 'true')
    response.headers.set('x-bot-verified', googleCheck.verified ? 'true' : 'false')
    response.headers.set('x-block-reason', googleCheck.reason)
    response.headers.set('x-original-path', pathname)
    response.headers.set('x-request-id', requestId)
    response.headers.set('x-original-pathname', pathname)

    // 传递请求详情
    response.headers.set('x-request-host', realHost)
    response.headers.set('x-request-url', fullUrl)
    response.headers.set('x-request-method', method)
    response.headers.set('x-request-protocol', protocol)

    // 传递 Cloudflare 地理信息
    const cfCountry = request.headers.get('cf-ipcountry')
    const cfCity = request.headers.get('cf-ipcity')
    const cfRegion = request.headers.get('cf-region')
    const cfTimezone = request.headers.get('cf-timezone')
    if (cfCountry)
      response.headers.set('x-cf-country', cfCountry)
    if (cfCity)
      response.headers.set('x-cf-city', cfCity)
    if (cfRegion)
      response.headers.set('x-cf-region', cfRegion)
    if (cfTimezone)
      response.headers.set('x-cf-timezone', cfTimezone)

    return response
  }

  // 非 Google 访问，允许通过
  const response = NextResponse.next()
  response.headers.set('x-blocked', 'false')
  response.headers.set('x-is-google-bot', 'false')
  response.headers.set('x-request-id', requestId)
  response.headers.set('x-original-pathname', pathname)

  // 传递请求详情
  response.headers.set('x-request-host', realHost)
  response.headers.set('x-request-url', fullUrl)
  response.headers.set('x-request-method', method)
  response.headers.set('x-request-protocol', protocol)

  // 传递 Cloudflare 地理信息
  const cfCountry = request.headers.get('cf-ipcountry')
  const cfCity = request.headers.get('cf-ipcity')
  const cfRegion = request.headers.get('cf-region')
  const cfTimezone = request.headers.get('cf-timezone')
  if (cfCountry)
    response.headers.set('x-cf-country', cfCountry)
  if (cfCity)
    response.headers.set('x-cf-city', cfCity)
  if (cfRegion)
    response.headers.set('x-cf-region', cfRegion)
  if (cfTimezone)
    response.headers.set('x-cf-timezone', cfTimezone)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
