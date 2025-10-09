#!/usr/bin/env node

import { PrismaClient } from '../lib/generated/prisma/index.js'

const prisma = new PrismaClient()

async function debugConfig() {
  try {
    console.log('=== 配置诊断工具 ===\n')

    // 查询所有配置
    const allConfigs = await prisma.urlConfig.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 数据库中共有 ${allConfigs.length} 条配置\n`)

    if (allConfigs.length === 0) {
      console.log('⚠️  数据库中没有任何配置！')
      console.log('\n建议：')
      console.log('1. 访问配置页面：https://your-domain.com?config=1')
      console.log('2. 设置 CTA 链接')
      console.log('3. 点击保存')
      return
    }

    // 显示所有配置
    allConfigs.forEach((config, index) => {
      console.log(`[${index + 1}] 配置详情:`)
      console.log(`   Host: ${config.host}`)
      console.log(`   Path: ${config.path}`)
      console.log(`   Page Internal: ${config.pageInternal}`)
      
      // 解析 CTAs
      let ctas
      try {
        ctas = typeof config.ctas === 'string' ? JSON.parse(config.ctas) : config.ctas
      } catch {
        ctas = config.ctas
      }
      console.log(`   CTAs:`, ctas)
      
      // 检查是否是默认值
      if (ctas?.primary === '#' || ctas?.primary === '' || !ctas?.primary) {
        console.log('   ⚠️  警告：Primary CTA 未配置或为默认值！')
      } else {
        console.log(`   ✅ Primary CTA: ${ctas.primary}`)
      }
      
      console.log(`   创建时间: ${config.createdAt}`)
      console.log(`   更新时间: ${config.updatedAt}`)
      console.log('')
    })

    // 检查特定 host/path
    console.log('\n=== 特定配置检查 ===')
    const testConfigs = [
      { host: 'pk.valuemaryet.top', path: '/g' },
      { host: 'make.valuemaryet.top', path: '/landing' },
      { host: 'localhost', path: '/g' },
    ]

    for (const { host, path } of testConfigs) {
      const config = await prisma.urlConfig.findUnique({
        where: {
          host_path: { host, path }
        }
      })

      if (config) {
        console.log(`✅ 找到配置: ${host}${path}`)
        let ctas
        try {
          ctas = typeof config.ctas === 'string' ? JSON.parse(config.ctas) : config.ctas
        } catch {
          ctas = config.ctas
        }
        console.log(`   Primary CTA: ${ctas?.primary || '未设置'}`)
        console.log(`   Secondary CTA: ${ctas?.secondary || '未设置'}`)
      } else {
        console.log(`❌ 未找到配置: ${host}${path}`)
      }
    }

  } catch (error) {
    console.error('❌ 错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugConfig()

