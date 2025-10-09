/**
 * 服务端日志记录工具
 * 运行在 Node.js runtime，可以直接使用 Prisma
 */

import { headers } from 'next/headers'
import { cache } from 'react'
import { getLanguageFromHeaders, normalizeLanguage } from './language'
import { prisma } from './prisma'

/**
 * 记录页面访问（使用 React cache 确保同一请求只执行一次）
 * @param _requestId 请求唯一ID（被 React cache 用作 key）
 */
async function logPageViewInternal(_requestId: string) {
  try {
    const headersList = await headers()
    const userLang = normalizeLanguage(
      getLanguageFromHeaders(headersList.get('accept-language')),
    )

    // 从 middleware 设置的 headers 中读取信息
    const originalPath = headersList.get('x-original-pathname') || headersList.get('x-original-path') || '/'
    const isBlocked = headersList.get('x-blocked') === 'true'
    const blockReason = headersList.get('x-block-reason') || null
    const isGoogleBot = headersList.get('x-is-google-bot') === 'true'
    const botVerified = headersList.get('x-bot-verified') === 'true'

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
        ip: headersList.get('x-real-ip')
          || undefined,
      },
    })
  }
  catch (error) {
    // 记录失败不应该影响页面渲染
    console.error('Failed to log page view:', error)
  }
}

/**
 * 导出的日志记录函数（使用 React cache 包装）
 * 同一个请求 ID 只会执行一次数据库写入
 */
export const logPageView = cache(logPageViewInternal)
