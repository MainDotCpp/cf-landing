import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { RequestLog } from '@/lib/request-logger'

// 使用 Node.js runtime 以支持 Prisma
export const runtime = 'nodejs'

/**
 * POST /api/log-persist - 持久化单条日志到数据库
 * 供 middleware 调用
 */
export async function POST(request: NextRequest) {
  try {
    const log: RequestLog = await request.json()
    
    console.log('Persisting log to database:', log)
    
    // 保存到数据库
    const result = await prisma.requestLog.create({
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
    
    console.log('Log persisted successfully:', result.id)
    
    return NextResponse.json({ success: true, id: result.id })
  }
  catch (error) {
    console.error('Failed to persist log:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

