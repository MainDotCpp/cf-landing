#!/usr/bin/env node

import { PrismaClient } from '../lib/generated/prisma/index.js'

const prisma = new PrismaClient()

async function fixDoubleJsonSerialization() {
  try {
    console.log('=== 修复双重 JSON 序列化问题 ===\n')

    // 1. 查询所有配置
    const allConfigs = await prisma.urlConfig.findMany()

    console.log(`📊 找到 ${allConfigs.length} 条配置\n`)

    if (allConfigs.length === 0) {
      console.log('✅ 数据库中没有配置，无需修复')
      return
    }

    let fixed = 0
    let alreadyFixed = 0

    for (const config of allConfigs) {
      console.log(`\n检查配置: ${config.host}${config.path}`)

      let needsUpdate = false
      let fixedCtas = config.ctas
      let fixedAnalytics = config.analyticsSnippet

      // 检查 ctas 是否被双重序列化
      if (config.ctas) {
        const ctasType = typeof config.ctas
        console.log(`  CTAs 类型: ${ctasType}`)

        if (ctasType === 'string') {
          // 如果是字符串，说明被双重序列化了
          console.log(`  ⚠️  CTAs 被双重序列化，需要修复`)
          try {
            fixedCtas = JSON.parse(config.ctas)
            needsUpdate = true
          } catch (e) {
            console.log(`  ❌ 无法解析 CTAs:`, e.message)
          }
        } else if (ctasType === 'object') {
          console.log(`  ✅ CTAs 已经是对象，无需修复`)
        }
      }

      // 检查 analyticsSnippet 是否被双重序列化
      if (config.analyticsSnippet) {
        const analyticsType = typeof config.analyticsSnippet
        console.log(`  Analytics 类型: ${analyticsType}`)

        if (analyticsType === 'string') {
          console.log(`  ⚠️  Analytics 被双重序列化，需要修复`)
          try {
            fixedAnalytics = JSON.parse(config.analyticsSnippet)
            needsUpdate = true
          } catch (e) {
            console.log(`  ❌ 无法解析 Analytics:`, e.message)
          }
        } else if (analyticsType === 'object') {
          console.log(`  ✅ Analytics 已经是对象，无需修复`)
        }
      }

      // 如果需要更新
      if (needsUpdate) {
        console.log(`  🔧 正在修复...`)
        await prisma.urlConfig.update({
          where: { id: config.id },
          data: {
            ctas: fixedCtas,
            analyticsSnippet: fixedAnalytics,
          },
        })
        console.log(`  ✅ 修复成功`)
        fixed++
      } else {
        alreadyFixed++
      }
    }

    console.log('\n\n=== 修复完成 ===')
    console.log(`总计: ${allConfigs.length} 条`)
    console.log(`已修复: ${fixed} 条`)
    console.log(`无需修复: ${alreadyFixed} 条`)

    if (fixed > 0) {
      console.log('\n✅ 现在配置应该可以正常工作了！')
      console.log('💡 建议：重新访问配置页面验证')
    }

  } catch (error) {
    console.error('❌ 错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixDoubleJsonSerialization()

