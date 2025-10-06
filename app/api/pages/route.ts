import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

interface PageInfo {
  path: string
  name: string
  location: string
}

function getPageName(pagePath: string): string {
  if (pagePath === '/')
    return '首页'

  // 移除开头的斜杠并分割路径
  const segments = pagePath.slice(1).split('/')
  const lastName = segments[segments.length - 1]

  // 转换为更友好的名称
  const nameMap: Record<string, string> = {
    contact: '联系页面',
    legal: '法律声明',
    privacy: '隐私政策',
    LkklRt: 'LkklRt',
    page1: 'Page1',
  }

  return nameMap[lastName] || lastName
}

async function findPages(dir: string, baseDir: string, prefix = ''): Promise<PageInfo[]> {
  const pages: PageInfo[] = []

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.relative(baseDir, fullPath)

      if (entry.isDirectory()) {
        // 跳过一些特殊目录
        if (entry.name.startsWith('_')
          || entry.name.startsWith('.')
          || entry.name === 'node_modules'
          || entry.name === 'api'
          || entry.name === 'config'
          || entry.name.startsWith('[')) {
          continue
        }

        // 递归搜索子目录
        const subPages = await findPages(fullPath, baseDir, `${prefix}/${entry.name}`)
        pages.push(...subPages)
      }
      else if (entry.name === 'page.tsx' || entry.name === 'page.ts' || entry.name === 'page.jsx' || entry.name === 'page.js') {
        // 找到页面文件
        const pagePath = prefix || '/'
        const location = relativePath.replace(/\/page\.(tsx|ts|jsx|js)$/, '')

        pages.push({
          path: pagePath,
          name: getPageName(pagePath),
          location: location || 'app',
        })
      }
    }
  }
  catch (error) {
    console.error('Error reading directory:', error)
  }

  return pages
}

export async function GET() {
  try {
    const appDir = path.join(process.cwd(), 'app')
    const pages: PageInfo[] = []

    // 扫描 app 目录
    const appPages = await findPages(appDir, appDir)
    pages.push(...appPages)

    // 扫描 app/(pages)/(jp) 目录
    const jpDir = path.join(appDir, '(pages)', '(jp)')
    try {
      const jpPages = await findPages(jpDir, jpDir)
      pages.push(...jpPages.map(p => ({
        ...p,
        location: `app/(pages)/(jp)/${p.location}`,
      })))
    }
    catch {
      // 如果目录不存在，跳过
    }

    // 去重：优先保留路径更短的（去除括号路径）
    const pageMap = new Map<string, PageInfo>()
    for (const page of pages) {
      // 标准化路径：移除括号
      const normalizedPath = page.path.replace(/\/?\([^)]+\)\/?/g, '/')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '') || '/'

      const existing = pageMap.get(normalizedPath)
      // 如果没有现有的，或者当前路径更短（更简洁），则使用当前的
      if (!existing || page.path.length < existing.path.length || !page.path.includes('(')) {
        pageMap.set(normalizedPath, {
          ...page,
          path: normalizedPath, // 使用标准化后的路径
        })
      }
    }

    // 排序
    const uniquePages = Array.from(pageMap.values()).sort((a, b) => {
      if (a.path === '/')
        return -1
      if (b.path === '/')
        return 1
      return a.path.localeCompare(b.path)
    })

    return NextResponse.json(uniquePages)
  }
  catch (error) {
    console.error('Error finding pages:', error)
    return NextResponse.json(
      { error: 'Failed to find pages' },
      { status: 500 },
    )
  }
}
