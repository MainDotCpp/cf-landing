/**
 * Middleware: Google 访问屏蔽
 * 检测并屏蔽所有 Google bot 和爬虫访问
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isGoogleBot, shouldBlockGoogle } from '@/lib/google-detector'

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

  // 获取访问者信息
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
  const userAgent = request.headers.get('user-agent') || ''

  // 检测是否为 Google bot
  const googleCheck = isGoogleBot(ip, userAgent)
  const shouldBlock = shouldBlockGoogle(googleCheck)

  // 如果需要屏蔽，重定向到首页
  if (shouldBlock) {
    const url = request.nextUrl.clone()
    url.pathname = '/'

    const response = NextResponse.rewrite(url)
    response.headers.set('x-blocked', 'true')
    response.headers.set('x-blocked-reason', 'google-bot')
    response.headers.set('x-is-google-bot', 'true')
    response.headers.set('x-bot-verified', googleCheck.verified ? 'true' : 'false')
    response.headers.set('x-block-reason', googleCheck.reason)
    response.headers.set('x-original-path', pathname)

    return response
  }

  // 非 Google 访问，允许通过
  const response = NextResponse.next()
  response.headers.set('x-blocked', 'false')
  response.headers.set('x-is-google-bot', 'false')
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
