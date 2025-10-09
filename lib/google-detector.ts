/**
 * Google 访问检测器
 * 通过 IP 地址段和 User-Agent 双重验证
 */

import { GOOGLE_USER_AGENTS, GOOGLEBOT_IPV4_RANGES, GOOGLEBOT_IPV6_RANGES } from './google-ip-ranges'
import { extractFirstIP, getIPVersion, isIPInRanges } from './ip-utils'

export interface GoogleBotCheckResult {
  isGoogle: boolean
  reason: string
  verified: boolean
  ipMatch: boolean
  uaMatch: boolean
}

/**
 * 检测 User-Agent 是否包含 Google bot 特征
 */
export function isGoogleUserAgent(userAgent: string): boolean {
  if (!userAgent)
    return false

  const ua = userAgent.toLowerCase()
  return GOOGLE_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()))
}

/**
 * 检测 IP 地址是否属于 Google (支持 IPv4 和 IPv6)
 */
export function isGoogleIP(ip: string | null): boolean {
  if (!ip)
    return false

  // 提取第一个 IP（处理 x-forwarded-for 多 IP 情况）
  const firstIP = extractFirstIP(ip)
  if (!firstIP)
    return false

  // 检测 IP 版本
  const version = getIPVersion(firstIP)

  // 根据 IP 版本检查对应的地址段
  if (version === 4) {
    return isIPInRanges(firstIP, GOOGLEBOT_IPV4_RANGES)
  }
  else if (version === 6) {
    return isIPInRanges(firstIP, GOOGLEBOT_IPV6_RANGES)
  }

  return false
}

/**
 * 综合检测是否为 Google bot
 * 策略：IP 和 User-Agent 都匹配才认为是真正的 Google
 *
 * @param ip - 访问者 IP 地址
 * @param userAgent - User-Agent 字符串
 * @returns 检测结果对象
 */
export function isGoogleBot(
  ip: string | null,
  userAgent: string,
): GoogleBotCheckResult {
  const uaMatch = isGoogleUserAgent(userAgent)
  const ipMatch = isGoogleIP(ip)

  // 情况 1: IP 和 UA 都匹配 - 真正的 Google bot
  if (ipMatch && uaMatch) {
    return {
      isGoogle: true,
      reason: 'Verified Google bot (IP + UA match)',
      verified: true,
      ipMatch: true,
      uaMatch: true,
    }
  }

  // 情况 2: 只有 UA 匹配，IP 不匹配 - 可能是假冒
  if (uaMatch && !ipMatch) {
    return {
      isGoogle: true,
      reason: 'Suspicious: Google UA but non-Google IP (likely fake)',
      verified: false,
      ipMatch: false,
      uaMatch: true,
    }
  }

  // 情况 3: 只有 IP 匹配，UA 不匹配 - 来自 Google IP，拦截
  // 策略：100% 拦截所有来自 Google IP 段的访问
  if (ipMatch && !uaMatch) {
    return {
      isGoogle: true,
      reason: 'Google IP detected (blocking all Google network traffic)',
      verified: false,
      ipMatch: true,
      uaMatch: false,
    }
  }

  // 情况 4: 都不匹配 - 正常用户
  return {
    isGoogle: false,
    reason: 'Not Google',
    verified: false,
    ipMatch: false,
    uaMatch: false,
  }
}

/**
 * 判断是否应该屏蔽此访问
 * 当前策略：屏蔽所有 Google（包括未验证的）
 */
export function shouldBlockGoogle(checkResult: GoogleBotCheckResult): boolean {
  return checkResult.isGoogle
}
