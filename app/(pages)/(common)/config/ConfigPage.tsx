'use client'

import type { UrlConfig } from '@/types/config'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorState } from './components/ErrorState'
import { FormField } from './components/FormField'
import { LoadingState } from './components/LoadingState'
import { PageSelector } from './components/PageSelector'
import { useAvailablePages, useConfigMutation, useConfigQuery } from './hooks/useConfigData'

export default function ConfigPage() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  // 数据获取
  const { data: config, isLoading, error, refetch } = useConfigQuery(currentPath)
  const { data: pages = [] } = useAvailablePages()
  const mutation = useConfigMutation(currentPath)

  // 表单数据状态
  const [formData, setFormData] = useState<Partial<UrlConfig>>({})

  // 当配置加载完成后，初始化表单数据
  useEffect(() => {
    // 即使配置不存在，API 也会返回 host 和 path，因此 config 应该总是存在
    if (config) {
      setFormData(config)
    }
  }, [config])

  // 保存配置
  const handleSave = async () => {
    await mutation.mutateAsync(formData)
  }

  // 重置表单到原始数据
  const handleReset = () => {
    setFormData(config || {})
  }

  // 更新字段
  const updateField = (field: keyof UrlConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateCta = (type: 'primary' | 'secondary', value: string) => {
    setFormData(prev => ({
      ...prev,
      ctas: { ...prev.ctas, [type]: value },
    }))
  }

  const updateAnalytics = (field: 'headHtml' | 'bodyStartHtml' | 'bodyEndHtml', value: string) => {
    setFormData(prev => ({
      ...prev,
      analyticsSnippet: { ...prev.analyticsSnippet, [field]: value },
    }))
  }

  // 加载状态
  if (isLoading) {
    return <LoadingState />
  }

  // 错误状态
  if (error) {
    return <ErrorState error={error.message} onRetry={() => refetch()} />
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
              <code className="bg-slate-200 px-2 py-1 rounded">{formData.host || config?.host || '加载中...'}</code>
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
              <FormField
                label="主机 (Host)"
                value={formData.host || ''}
                disabled
              />
              <FormField
                label="路径 (Path)"
                value={formData.path || ''}
                disabled
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  内部页面 (Page Internal)
                </label>
                <PageSelector
                  value={formData.pageInternal || '/'}
                  onChange={value => updateField('pageInternal', value)}
                  pages={pages}
                />
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
              <FormField
                label="主要按钮链接 (Primary)"
                value={formData.ctas?.primary || ''}
                onChange={value => updateCta('primary', value)}
                placeholder="https://example.com"
              />
              <FormField
                label="次要按钮链接 (Secondary)"
                value={formData.ctas?.secondary || ''}
                onChange={value => updateCta('secondary', value)}
                placeholder="https://example.com"
              />
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>分析代码片段</CardTitle>
              <CardDescription>页面分析和追踪代码</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Head HTML"
                value={formData.analyticsSnippet?.headHtml || ''}
                onChange={value => updateAnalytics('headHtml', value)}
                type="textarea"
                placeholder="<!-- Analytics code -->"
              />
              <FormField
                label="Body Start HTML"
                value={formData.analyticsSnippet?.bodyStartHtml || ''}
                onChange={value => updateAnalytics('bodyStartHtml', value)}
                type="textarea"
                placeholder="<!-- Analytics code -->"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending ? '保存中...' : '保存配置'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={mutation.isPending}
              className="flex-1"
            >
              重置
            </Button>
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
