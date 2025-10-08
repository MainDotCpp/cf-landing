'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RequestLog {
  timestamp: string
  path: string
  userLanguage: string
  allowedLanguages: string
  isBlocked: boolean
  userAgent?: string
  referer?: string
  ip?: string
}

interface Stats {
  total: number
  blocked: number
  allowed: number
  blockRate: string
  pathStats: Record<string, { total: number, blocked: number }>
  languageStats: Record<string, { total: number, blocked: number }>
}

export default function LogsPage() {
  const [logs, setLogs] = useState<RequestLog[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filter, setFilter] = useState<'all' | 'blocked' | 'allowed'>('all')
  const [loading, setLoading] = useState(false)

  const fetchLogs = async (type: 'all' | 'blocked' | 'allowed' = 'all') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/logs?type=${type}`)
      const data = await response.json()
      setLogs(data.logs || [])
    }
    catch (error) {
      console.error('Failed to fetch logs:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/logs?type=stats')
      const data = await response.json()
      setStats(data)
    }
    catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const clearLogs = async () => {
    if (!confirm('确定要清空所有日志吗？')) return
    
    try {
      await fetch('/api/logs', { method: 'DELETE' })
      fetchLogs(filter)
      fetchStats()
    }
    catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  const downloadCSV = () => {
    window.open(`/api/logs?type=${filter}&format=csv`, '_blank')
  }

  useEffect(() => {
    fetchLogs(filter)
    fetchStats()
    
    // 每 5 秒自动刷新
    const interval = setInterval(() => {
      fetchLogs(filter)
      fetchStats()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [filter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900">请求日志</h1>
            <p className="text-slate-600 mt-2">实时监控请求和语言过滤情况</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => fetchLogs(filter)} variant="outline">
              刷新
            </Button>
            <Button onClick={downloadCSV} variant="outline">
              导出 CSV
            </Button>
            <Button onClick={clearLogs} variant="destructive">
              清空日志
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>总请求数</CardDescription>
                <CardTitle className="text-4xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>允许访问</CardDescription>
                <CardTitle className="text-4xl text-green-600">{stats.allowed}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>被拦截</CardDescription>
                <CardTitle className="text-4xl text-red-600">{stats.blocked}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>拦截率</CardDescription>
                <CardTitle className="text-4xl">{stats.blockRate}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Stats Details */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Path Stats */}
            <Card>
              <CardHeader>
                <CardTitle>路径统计</CardTitle>
                <CardDescription>各路径的访问和拦截情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.pathStats).map(([path, stat]) => (
                    <div key={path} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-mono text-sm">{path}</div>
                        <div className="text-xs text-slate-500">
                          总计: {stat.total} | 拦截: {stat.blocked}
                        </div>
                      </div>
                      <div className="text-sm font-bold">
                        {stat.total > 0 ? ((stat.blocked / stat.total) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Stats */}
            <Card>
              <CardHeader>
                <CardTitle>语言统计</CardTitle>
                <CardDescription>各语言用户的访问情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.languageStats).map(([lang, stat]) => (
                    <div key={lang} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{lang.toUpperCase()}</div>
                        <div className="text-xs text-slate-500">
                          总计: {stat.total} | 拦截: {stat.blocked}
                        </div>
                      </div>
                      <div className="text-sm font-bold">
                        {stat.total > 0 ? ((stat.blocked / stat.total) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>请求日志</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  全部 ({logs.length})
                </Button>
                <Button
                  variant={filter === 'allowed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('allowed')}
                >
                  允许
                </Button>
                <Button
                  variant={filter === 'blocked' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('blocked')}
                >
                  拦截
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">加载中...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">暂无日志</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      log.isBlocked
                        ? 'bg-red-50 border-red-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {log.isBlocked ? '🚫' : '✅'}
                        </span>
                        <div>
                          <div className="font-mono text-sm font-bold">{log.path}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleString('zh-CN')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          用户语言: <span className="text-blue-600">{log.userLanguage}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          允许语言: {log.allowedLanguages}
                        </div>
                      </div>
                    </div>
                    {(log.userAgent || log.referer || log.ip) && (
                      <div className="text-xs text-slate-500 space-y-1 mt-2 pt-2 border-t">
                        {log.ip && <div>IP: {log.ip}</div>}
                        {log.referer && <div>来源: {log.referer}</div>}
                        {log.userAgent && <div className="truncate">UA: {log.userAgent}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

