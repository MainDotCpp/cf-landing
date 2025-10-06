'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UrlConfig {
  host: string
  path: string
  pageInternal: string
  ctas: {
    primary?: string
    secondary?: string
  }
  analyticsSnippet: {
    headHtml?: string
    bodyStartHtml?: string
    bodyEndHtml?: string
  }
}

interface PageInfo {
  path: string
  name: string
  location: string
}

export default function ConfigPage() {
  const [config, setConfig] = useState<UrlConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UrlConfig>>({})
  const [availablePages, setAvailablePages] = useState<PageInfo[]>([])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      // 发送当前路径给 API
      const currentPath = window.location.pathname
      const response = await fetch(`/api/config?path=${encodeURIComponent(currentPath)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch config')
      }
      const data = await response.json() as UrlConfig
      setConfig(data)
      setFormData(data)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    finally {
      setLoading(false)
    }
  }

  const fetchAvailablePages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const pages = await response.json() as PageInfo[]
        setAvailablePages(pages)
      }
    }
    catch (err) {
      console.error('Failed to fetch available pages:', err)
    }
  }

  useEffect(() => {
    void fetchConfig()
    void fetchAvailablePages()
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      const currentPath = window.location.pathname
      const response = await fetch(`/api/config?path=${encodeURIComponent(currentPath)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save config')
      }

      const data = await response.json() as UrlConfig
      setConfig(data)
      setEditing(false)
      // eslint-disable-next-line no-alert
      window.alert('配置已保存！')
    }
    catch (err) {
      // eslint-disable-next-line no-alert
      window.alert(`保存失败: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    finally {
      setLoading(false)
    }
  }

  if (loading && !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">加载配置中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">错误</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchConfig}>重试</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">URL 配置管理</h1>
            <p className="text-slate-600">
              当前主机:
              {' '}
              <code className="bg-slate-200 px-2 py-1 rounded">{config?.host}</code>
            </p>
          </div>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
            ← 返回首页
          </Link>
        </div>

        {/* Configuration Cards */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
              <CardDescription>主机和路径配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  主机 (Host)
                </label>
                <input
                  type="text"
                  value={formData.host || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  路径 (Path)
                </label>
                <input
                  type="text"
                  value={formData.path || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  内部页面 (Page Internal)
                </label>
                {editing
                  ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.pageInternal || '/'}
                          onChange={e => setFormData({ ...formData, pageInternal: e.target.value })}
                          placeholder="/contact"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {availablePages.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-600 mb-2 font-medium">可用页面：</p>
                            <div className="flex flex-wrap gap-2">
                              {availablePages.map(page => (
                                <button
                                  key={page.path}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, pageInternal: page.path })}
                                  className="group px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 border border-slate-200 hover:border-blue-300 rounded-md transition-all"
                                  title={page.location}
                                >
                                  <span className="font-medium">{page.name}</span>
                                  <span className="text-slate-400 group-hover:text-blue-600 ml-1">
                                    (
                                    {page.path}
                                    )
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-slate-500">
                          点击上方按钮快速选择，或手动输入任何有效的页面路径
                        </p>
                      </div>
                    )
                  : (
                      <input
                        type="text"
                        value={formData.pageInternal || '/'}
                        disabled
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50"
                      />
                    )}
              </div>
            </CardContent>
          </Card>

          {/* CTA Links */}
          <Card>
            <CardHeader>
              <CardTitle>CTA 按钮链接</CardTitle>
              <CardDescription>配置页面上的行动号召按钮链接</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  主要按钮链接 (Primary)
                </label>
                {editing
                  ? (
                      <input
                        type="text"
                        value={formData.ctas?.primary || ''}
                        onChange={e => setFormData({
                          ...formData,
                          ctas: { ...formData.ctas, primary: e.target.value },
                        })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )
                  : (
                      <input
                        type="text"
                        value={formData.ctas?.primary || ''}
                        disabled
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50"
                      />
                    )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  次要按钮链接 (Secondary)
                </label>
                {editing
                  ? (
                      <input
                        type="text"
                        value={formData.ctas?.secondary || ''}
                        onChange={e => setFormData({
                          ...formData,
                          ctas: { ...formData.ctas, secondary: e.target.value },
                        })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )
                  : (
                      <input
                        type="text"
                        value={formData.ctas?.secondary || ''}
                        disabled
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50"
                      />
                    )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>分析代码片段</CardTitle>
              <CardDescription>页面分析和追踪代码</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Head HTML
                </label>
                {editing
                  ? (
                      <textarea
                        value={formData.analyticsSnippet?.headHtml || ''}
                        onChange={e => setFormData({
                          ...formData,
                          analyticsSnippet: { ...formData.analyticsSnippet, headHtml: e.target.value },
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="<!-- Analytics code -->"
                      />
                    )
                  : (
                      <pre className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-sm overflow-x-auto">
                        {formData.analyticsSnippet?.headHtml || '(空)'}
                      </pre>
                    )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Body Start HTML
                </label>
                {editing
                  ? (
                      <textarea
                        value={formData.analyticsSnippet?.bodyStartHtml || ''}
                        onChange={e => setFormData({
                          ...formData,
                          analyticsSnippet: { ...formData.analyticsSnippet, bodyStartHtml: e.target.value },
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="<!-- Analytics code -->"
                      />
                    )
                  : (
                      <pre className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-sm overflow-x-auto">
                        {formData.analyticsSnippet?.bodyStartHtml || '(空)'}
                      </pre>
                    )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            {editing
              ? (
                  <>
                    <Button onClick={handleSave} disabled={loading} className="flex-1">
                      {loading ? '保存中...' : '保存更改'}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditing(false)
                        setFormData(config || {})
                      }}
                      variant="outline"
                      disabled={loading}
                      className="flex-1"
                    >
                      取消
                    </Button>
                  </>
                )
              : (
                  <Button onClick={() => setEditing(true)} className="flex-1">
                    编辑配置
                  </Button>
                )}
          </div>
        </div>

        {/* Info Box */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>
              修改
              <code className="bg-blue-100 px-1 py-0.5 rounded">pageInternal</code>
              可以改变此URL显示的页面内容，而不改变URL本身。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
