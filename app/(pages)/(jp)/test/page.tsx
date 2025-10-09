'use client'

import { useConfig } from '@/components/ConfigProvider'

export default function TestPage() {
  const config = useConfig()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Config Debug</h1>

      <div className="bg-slate-100 p-4 rounded">
        <h2 className="font-bold mb-2">Config 数据:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <div className="mt-4 bg-yellow-100 p-4 rounded">
        <h2 className="font-bold mb-2">诊断信息:</h2>
        <p>
          当前路径:
          {' '}
          {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
        </p>
        <p>
          Config 状态:
          {' '}
          {config ? '✅ 存在' : '❌ 为 null'}
        </p>
        {config && (
          <>
            <p>
              Page Internal:
              {' '}
              {config.pageInternal}
            </p>
            <p>
              Primary CTA:
              {' '}
              {config.ctas?.primary || '未设置'}
            </p>
            <p>
              Secondary CTA:
              {' '}
              {config.ctas?.secondary || '未设置'}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 bg-blue-100 p-4 rounded">
        <h2 className="font-bold mb-2">解决方案:</h2>
        <p className="mb-2">如果 config 为 null，请:</p>
        <ol className="list-decimal ml-6">
          <li>
            访问配置页面创建配置:
            {' '}
            <a href="/test?config=1" className="text-blue-600 underline">
              点击这里
            </a>
          </li>
          <li>或者创建通配符配置（所有路径通用）</li>
        </ol>
      </div>
    </main>
  )
}
