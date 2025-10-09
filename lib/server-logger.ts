/**
 * 服务端日志记录工具
 * 运行在 Node.js runtime，可以直接使用 Prisma
 */

import { headers } from 'next/headers'
import { getLanguageFromHeaders, normalizeLanguage } from './language'
import { prisma } from './prisma'

/**
 * 记录页面访问
 * @param path 访问路径
 */
export async function logPageView(path: string) {
  try {
    const headersList = await headers()
    const userLang = normalizeLanguage(
      getLanguageFromHeaders(headersList.get('accept-language')),
    )

    // 从 middleware 设置的 headers 中读取屏蔽信息
    const isBlocked = headersList.get('x-blocked') === 'true'
    const blockReason = headersList.get('x-block-reason') || null
    const isGoogleBot = headersList.get('x-is-google-bot') === 'true'
    const botVerified = headersList.get('x-bot-verified') === 'true'
    const originalPath = headersList.get('x-original-path') || path

    await prisma.requestLog.create({
      data: {
        timestamp: new Date(),
        path: originalPath,
        userLanguage: userLang,
        allowedLanguages: isBlocked ? 'none' : 'all',
        isBlocked,
        isGoogleBot,
        botVerified,
        blockReason,
        userAgent: headersList.get('user-agent') || undefined,
        referer: headersList.get('referer') || undefined,
        ip:
          headersList.get('x-forwarded-for')
          || headersList.get('x-real-ip')
          || undefined,
      },
    })
  }
  catch (error) {
    // 记录失败不应该影响页面渲染
    console.error('Failed to log page view:', error)
  }
}
