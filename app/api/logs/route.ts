import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { requestLogger } from '@/lib/request-logger'

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

    // 获取统计信息
    if (type === 'stats') {
      const stats = requestLogger.getStats()
      return NextResponse.json(stats)
    }

    // 获取日志
    let logs
    switch (type) {
      case 'blocked':
        logs = requestLogger.getBlockedLogs()
        break
      case 'allowed':
        logs = requestLogger.getAllowedLogs()
        break
      default:
        logs = requestLogger.getLogs()
    }

    // 返回格式
    if (format === 'csv') {
      const csv = requestLogger.exportCSV()
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
    requestLogger.clear()
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
