/**
 * 服务端日志记录工具
 * 运行在 Node.js runtime，可以直接使用 Prisma
 */

import { headers } from 'next/headers'
import { cache } from 'react'
import { getRealIP } from './ip-utils'
import { getLanguageFromHeaders, normalizeLanguage } from './language'
import { prisma } from './prisma'
import { extractQueryParams, extractUtmParams, generateSessionId, parseUserAgent } from './request-parser'

/**
 * 记录页面访问（使用 React cache 确保同一请求只执行一次）
 * @param _requestId 请求唯一ID（被 React cache 用作 key）
 */
async function logPageViewInternal(_requestId: string) {
  try {
    const headersList = await headers()

    // 基础信息
    const userAgent = headersList.get('user-agent') || ''
    const userLang = normalizeLanguage(
      getLanguageFromHeaders(headersList.get('accept-language')),
    )
    const ip = getRealIP(headersList)

    // 从 middleware 设置的 headers 中读取信息
    const originalPath = headersList.get('x-original-pathname') || headersList.get('x-original-path') || '/'
    const isBlocked = headersList.get('x-blocked') === 'true'
    const blockReason = headersList.get('x-block-reason') || null
    const isGoogleBot = headersList.get('x-is-google-bot') === 'true'
    const botVerified = headersList.get('x-bot-verified') === 'true'

    // 请求详情
    const host = headersList.get('x-request-host') || undefined
    const url = headersList.get('x-request-url') || undefined
    const method = headersList.get('x-request-method') || 'GET'
    const protocol = headersList.get('x-request-protocol') || undefined

    // 解析设备和浏览器信息
    const deviceInfo = parseUserAgent(userAgent)

    // 提取 UTM 参数
    const utmParams = extractUtmParams(url || null)

    // 提取查询参数
    const queryParams = extractQueryParams(url || null)

    // 地理位置信息（来自 Cloudflare）
    const country = headersList.get('x-cf-country') || undefined
    const city = headersList.get('x-cf-city') || undefined
    const region = headersList.get('x-cf-region') || undefined
    const timezone = headersList.get('x-cf-timezone') || undefined

    // 会话 ID
    const sessionId = generateSessionId(ip, userAgent)

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

        // 基础信息
        userAgent: userAgent || undefined,
        referer: headersList.get('referer') || undefined,
        ip: ip || undefined,

        // 请求详情
        host,
        url,
        method,
        protocol,
        queryParams,

        // UTM 参数
        utmSource: utmParams.utmSource || undefined,
        utmMedium: utmParams.utmMedium || undefined,
        utmCampaign: utmParams.utmCampaign || undefined,
        utmTerm: utmParams.utmTerm || undefined,
        utmContent: utmParams.utmContent || undefined,

        // 设备信息
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        browserVersion: deviceInfo.browserVersion,
        os: deviceInfo.os,
        osVersion: deviceInfo.osVersion,

        // 地理位置
        country,
        city,
        region,
        timezone,

        // 会话
        sessionId,
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
