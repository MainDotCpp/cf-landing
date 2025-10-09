/**
 * IP 地址处理工具
 * 支持 IPv4 和 IPv6 的 CIDR 匹配和 IP 范围检查
 */

/**
 * 检测 IP 地址版本
 * @returns 4 (IPv4), 6 (IPv6), 或 null (无效)
 */
export function getIPVersion(ip: string): 4 | 6 | null {
  if (!ip)
    return null
  if (ip.includes('.'))
    return 4
  if (ip.includes(':'))
    return 6
  return null
}

/**
 * 将 IPv4 地址字符串转换为数字
 * 例如: "192.168.1.1" -> 3232235777
 */
export function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some(p => Number.isNaN(p) || p < 0 || p > 255)) {
    return 0
  }
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

/**
 * 将 IPv6 地址字符串转换为 BigInt (128位)
 * 例如: "2001:4860:4801:10::1" -> BigInt
 */
export function ipv6ToNumber(ip: string): bigint {
  try {
    // 展开省略的零
    let expanded = ip
    if (expanded.includes('::')) {
      const parts = expanded.split('::')
      const left = parts[0] ? parts[0].split(':') : []
      const right = parts[1] ? parts[1].split(':') : []
      const zeros = Array.from({ length: 8 - left.length - right.length }, () => '0')
      expanded = [...left, ...zeros, ...right].join(':')
    }

    // 分割为 8 个 16 位块
    const parts = expanded.split(':')
    if (parts.length !== 8)
      return 0n

    // 转换为 128 位 BigInt
    let result = 0n
    for (let i = 0; i < 8; i++) {
      const value = Number.parseInt(parts[i] || '0', 16)
      if (Number.isNaN(value))
        return 0n
      result = (result << 16n) | BigInt(value)
    }

    return result
  }
  catch {
    return 0n
  }
}

/**
 * 解析 CIDR 表示法
 * 例如: "66.249.64.0/19" -> { network: number, mask: number }
 */
export function parseCIDR(cidr: string): { network: number, mask: number } {
  const [ipStr, prefixStr] = cidr.split('/')
  const ip = ipToNumber(ipStr)
  const prefix = Number.parseInt(prefixStr, 10)

  if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    return { network: 0, mask: 0 }
  }

  // 创建子网掩码
  const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0

  return {
    network: (ip & mask) >>> 0,
    mask,
  }
}

/**
 * 解析 IPv6 CIDR 表示法
 * 例如: "2001:4860:4801:10::/64" -> { network: bigint, mask: bigint }
 */
export function parseIPv6CIDR(cidr: string): { network: bigint, mask: bigint } {
  const [ipStr, prefixStr] = cidr.split('/')
  const ip = ipv6ToNumber(ipStr)
  const prefix = Number.parseInt(prefixStr, 10)

  if (Number.isNaN(prefix) || prefix < 0 || prefix > 128) {
    return { network: 0n, mask: 0n }
  }

  // 创建子网掩码 (128 位)
  const mask = prefix === 0 ? 0n : (2n ** 128n - 1n) << BigInt(128 - prefix)

  return {
    network: ip & mask,
    mask,
  }
}

/**
 * 检查 IPv4 是否在指定的 CIDR 范围内
 */
export function isIPv4InCIDR(ip: string, cidr: string): boolean {
  const ipNum = ipToNumber(ip)
  if (ipNum === 0)
    return false

  const { network, mask } = parseCIDR(cidr)
  if (mask === 0)
    return false

  return ((ipNum & mask) >>> 0) === network
}

/**
 * 检查 IPv6 是否在指定的 CIDR 范围内
 */
export function isIPv6InCIDR(ip: string, cidr: string): boolean {
  const ipNum = ipv6ToNumber(ip)
  if (ipNum === 0n)
    return false

  const { network, mask } = parseIPv6CIDR(cidr)
  if (mask === 0n)
    return false

  return (ipNum & mask) === network
}

/**
 * 检查 IP 是否在指定的 CIDR 范围内 (自动识别 IPv4/IPv6)
 */
export function isIPInCIDR(ip: string, cidr: string): boolean {
  const version = getIPVersion(ip)

  if (version === 4) {
    return isIPv4InCIDR(ip, cidr)
  }
  else if (version === 6) {
    return isIPv6InCIDR(ip, cidr)
  }

  return false
}

/**
 * 检查 IP 是否在多个 CIDR 范围内的任一范围
 */
export function isIPInRanges(ip: string, ranges: string[]): boolean {
  return ranges.some(range => isIPInCIDR(ip, range))
}

/**
 * 从可能包含多个 IP 的字符串中提取第一个 IP
 * 例如: "1.2.3.4, 5.6.7.8" -> "1.2.3.4"
 */
export function extractFirstIP(ipString: string | null): string | null {
  if (!ipString)
    return null
  return ipString.split(',')[0].trim()
}

/**
 * 验证IP地址格式是否有效
 * 支持 IPv4 和 IPv6
 */
export function isValidIP(ip: string): boolean {
  if (!ip)
    return false

  // IPv4 正则
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  // IPv6 简化正则（基本验证）
  const ipv6Regex = /^[0-9a-fA-F:]+$/

  if (ipv4Regex.test(ip)) {
    // 验证每段是否在 0-255 范围内
    return ip.split('.').every((segment) => {
      const num = Number.parseInt(segment, 10)
      return num >= 0 && num <= 255
    })
  }

  return ipv6Regex.test(ip)
}

/**
 * 检查是否为私有/内网IP
 * 包括: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8
 */
export function isPrivateIP(ip: string): boolean {
  // 私有IPv4范围
  const privateRanges = [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    '127.0.0.0/8',
  ]

  return privateRanges.some(range => isIPInCIDR(ip, range))
}

/**
 * 从 Headers 中获取真实 IP 地址
 * 支持各种代理和CDN设置的headers
 *
 * 优先级（从高到低）：
 * 1. cf-connecting-ip (Cloudflare)
 * 2. x-real-ip (Nginx)
 * 3. x-forwarded-for (标准)
 * 4. x-client-ip
 * 5. true-client-ip (Akamai)
 * 6. x-cluster-client-ip
 * 7. forwarded (RFC 7239)
 *
 * @param headers - Next.js Headers 对象或普通对象
 * @returns 真实IP地址，如果无法获取则返回null
 */
export function getRealIP(
  headers: { get(name: string): string | null } | Record<string, string | null>,
): string | null {
  // 定义header优先级（从高到低）
  const headerPriority = [
    'cf-connecting-ip', // Cloudflare
    'x-real-ip', // Nginx
    'x-forwarded-for', // 标准（可能有多个IP）
    'x-client-ip', // 某些代理
    'true-client-ip', // Akamai
    'x-cluster-client-ip', // 某些负载均衡器
    'forwarded', // RFC 7239
  ]

  // 辅助函数：从对象中获取header
  const getHeader = (name: string): string | null => {
    if ('get' in headers && typeof headers.get === 'function') {
      return headers.get(name)
    }
    return (headers as Record<string, string | null>)[name] || null
  }

  // 按优先级检查每个header
  for (const headerName of headerPriority) {
    const value = getHeader(headerName)

    if (!value)
      continue

    // 特殊处理 forwarded header (RFC 7239格式)
    if (headerName === 'forwarded') {
      const match = value.match(/for=([^,;]+)/)
      if (match && match[1]) {
        const ip = match[1].replace(/^"?(.*?)"?$/, '$1').trim()
        if (isValidIP(ip))
          return ip
      }
      continue
    }

    // 提取第一个IP（处理逗号分隔的多IP情况）
    const firstIP = extractFirstIP(value)

    if (firstIP && isValidIP(firstIP)) {
      return firstIP
    }
  }

  return null
}
