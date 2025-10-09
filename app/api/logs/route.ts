import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 日志从数据库读取
// middleware 通过 /api/log-persist 持久化到数据库

/**
 * GET /api/logs - 获取日志
 * 查询参数：
 * - type: 'all' | 'blocked' | 'allowed' | 'stats'
 * - format: 'json' | 'csv'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const format = searchParams.get('format') || 'json'

    // 从数据库加载日志（按时间倒序，最近1000条）
    const dbLogs = await prisma.requestLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1000,
    })

    // 转换为 RequestLog 格式
    const allLogs = dbLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      path: log.path,
      userLanguage: log.userLanguage,
      allowedLanguages: log.allowedLanguages,
      isBlocked: log.isBlocked,
      userAgent: log.userAgent || undefined,
      referer: log.referer || undefined,
      ip: log.ip || undefined,
    }))

    // 获取统计信息
    if (type === 'stats') {
      const total = allLogs.length
      const blocked = allLogs.filter(log => log.isBlocked).length
      const allowed = total - blocked

      // 按路径统计
      const pathStats: Record<string, { total: number, blocked: number }> = {}
      for (const log of allLogs) {
        if (!pathStats[log.path]) {
          pathStats[log.path] = { total: 0, blocked: 0 }
        }
        pathStats[log.path].total++
        if (log.isBlocked)
          pathStats[log.path].blocked++
      }

      // 按语言统计
      const languageStats: Record<string, { total: number, blocked: number }> = {}
      for (const log of allLogs) {
        if (!languageStats[log.userLanguage]) {
          languageStats[log.userLanguage] = { total: 0, blocked: 0 }
        }
        languageStats[log.userLanguage].total++
        if (log.isBlocked)
          languageStats[log.userLanguage].blocked++
      }

      return NextResponse.json({
        total,
        blocked,
        allowed,
        blockRate: total > 0 ? `${((blocked / total) * 100).toFixed(2)}%` : '0%',
        pathStats,
        languageStats,
      })
    }

    // 过滤日志
    let logs = allLogs
    if (type === 'blocked') {
      logs = allLogs.filter(log => log.isBlocked)
    }
    else if (type === 'allowed') {
      logs = allLogs.filter(log => !log.isBlocked)
    }

    // 返回格式
    if (format === 'csv') {
      const headers = ['Timestamp', 'Path', 'User Language', 'Allowed Languages', 'Is Blocked', 'User Agent', 'Referer', 'IP']
      const rows = logs.map(log => [
        log.timestamp,
        log.path,
        log.userLanguage,
        log.allowedLanguages,
        log.isBlocked ? 'YES' : 'NO',
        log.userAgent || '',
        log.referer || '',
        log.ip || '',
      ])

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="request-logs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({
      total: logs.length,
      logs,
    })
  }
  catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/logs - 清空日志
 */
export async function DELETE() {
  try {
    await prisma.requestLog.deleteMany({})
    return NextResponse.json({ message: 'Logs cleared successfully' })
  }
  catch (error) {
    console.error('Error clearing logs:', error)
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 },
    )
  }
}
