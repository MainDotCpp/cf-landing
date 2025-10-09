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
 * @param isBlocked 是否被语言过滤阻塞
 * @param allowedLanguages 允许的语言列表
 */
export async function logPageView(
  path: string,
  isBlocked: boolean,
  allowedLanguages: string,
) {
  try {
    const headersList = await headers()
    const userLang = normalizeLanguage(
      getLanguageFromHeaders(headersList.get('accept-language')),
    )

    await prisma.requestLog.create({
      data: {
        timestamp: new Date(),
        path,
        userLanguage: userLang,
        allowedLanguages,
        isBlocked,
        userAgent: headersList.get('user-agent') || undefined,
        referer: headersList.get('referer') || undefined,
        ip:
          headersList.get('x-forwarded-for')
          || headersList.get('x-real-ip')
          || undefined,
      },
    })

    // 可选：控制台输出
    if (isBlocked) {
      console.log(
        `🚫 [BLOCKED] ${new Date().toISOString()} | ${path} | User: ${userLang} | Allowed: ${allowedLanguages}`,
      )
    }
  }
  catch (error) {
    // 记录失败不应该影响页面渲染
    console.error('Failed to log page view:', error)
  }
}

