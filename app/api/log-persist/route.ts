import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { RequestLog } from '@/lib/request-logger'

/**
 * POST /api/log-persist - 持久化单条日志到数据库
 * 供 middleware 调用
 */
export async function POST(request: NextRequest) {
  try {
    const log: RequestLog = await request.json()
    
    // 保存到数据库
    await prisma.requestLog.create({
      data: {
        timestamp: new Date(log.timestamp),
        path: log.path,
        userLanguage: log.userLanguage,
        allowedLanguages: log.allowedLanguages,
        isBlocked: log.isBlocked,
        userAgent: log.userAgent,
        referer: log.referer,
        ip: log.ip,
      },
    })
    
    return NextResponse.json({ success: true })
  }
  catch (error) {
    console.error('Failed to persist log:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

