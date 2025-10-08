/**
 * 请求日志记录器
 * 用于记录请求日志和语言拦截情况
 */

export interface RequestLog {
  timestamp: string
  path: string
  userLanguage: string
  allowedLanguages: string
  isBlocked: boolean
  userAgent?: string
  referer?: string
  ip?: string
}

class RequestLogger {
  private logs: RequestLog[] = []
  private readonly maxLogs = 1000 // 最多保存 1000 条日志

  /**
   * 记录请求
   */
  log(logData: RequestLog) {
    this.logs.push(logData)
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // 控制台输出
    this.logToConsole(logData)
  }

  /**
   * 控制台输出
   */
  private logToConsole(logData: RequestLog) {
    const { timestamp, path, userLanguage, allowedLanguages, isBlocked } = logData

    if (isBlocked) {
      console.log(
        `🚫 [BLOCKED] ${timestamp} | ${path} | User: ${userLanguage} | Allowed: ${allowedLanguages}`,
      )
    }
    else {
      console.log(
        `✅ [ALLOWED] ${timestamp} | ${path} | User: ${userLanguage}`,
      )
    }
  }

  /**
   * 获取所有日志
   */
  getLogs(): RequestLog[] {
    return [...this.logs]
  }

  /**
   * 获取被拦截的日志
   */
  getBlockedLogs(): RequestLog[] {
    return this.logs.filter(log => log.isBlocked)
  }

  /**
   * 获取允许的日志
   */
  getAllowedLogs(): RequestLog[] {
    return this.logs.filter(log => !log.isBlocked)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const total = this.logs.length
    const blocked = this.getBlockedLogs().length
    const allowed = this.getAllowedLogs().length

    // 按路径统计
    const pathStats: Record<string, { total: number, blocked: number }> = {}
    for (const log of this.logs) {
      if (!pathStats[log.path]) {
        pathStats[log.path] = { total: 0, blocked: 0 }
      }
      pathStats[log.path].total++
      if (log.isBlocked) {
        pathStats[log.path].blocked++
      }
    }

    // 按语言统计
    const languageStats: Record<string, { total: number, blocked: number }> = {}
    for (const log of this.logs) {
      if (!languageStats[log.userLanguage]) {
        languageStats[log.userLanguage] = { total: 0, blocked: 0 }
      }
      languageStats[log.userLanguage].total++
      if (log.isBlocked) {
        languageStats[log.userLanguage].blocked++
      }
    }

    return {
      total,
      blocked,
      allowed,
      blockRate: total > 0 ? ((blocked / total) * 100).toFixed(2) + '%' : '0%',
      pathStats,
      languageStats,
    }
  }

  /**
   * 清空日志
   */
  clear() {
    this.logs = []
  }

  /**
   * 导出日志为 JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * 导出日志为 CSV
   */
  exportCSV(): string {
    const headers = ['Timestamp', 'Path', 'User Language', 'Allowed Languages', 'Is Blocked', 'User Agent', 'Referer', 'IP']
    const rows = this.logs.map(log => [
      log.timestamp,
      log.path,
      log.userLanguage,
      log.allowedLanguages,
      log.isBlocked ? 'YES' : 'NO',
      log.userAgent || '',
      log.referer || '',
      log.ip || '',
    ])

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')
  }
}

// 单例模式
const requestLogger = new RequestLogger()

export { requestLogger }

