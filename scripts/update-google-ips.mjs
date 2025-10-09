#!/usr/bin/env node

/**
 * 自动更新 Google IP 段脚本
 * 从 Google 官方 API 获取最新的 IP 地址段
 * 
 * 使用方法:
 *   node scripts/update-google-ips.mjs
 * 
 * 建议：设置 cron job 每月自动执行一次
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Google 官方 IP 段 API
const GOOGLEBOT_API = 'https://developers.google.com/search/apis/ipranges/googlebot.json'

async function fetchGoogleIPRanges() {
  console.log('📥 Fetching Google IP ranges from official API...')

  try {
    const response = await fetch(GOOGLEBOT_API)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 提取 IPv4 地址段
    const ipv4Ranges = data.prefixes
      .filter(prefix => prefix.ipv4Prefix)
      .map(prefix => prefix.ipv4Prefix)

    // 提取 IPv6 地址段
    const ipv6Ranges = data.prefixes
      .filter(prefix => prefix.ipv6Prefix)
      .map(prefix => prefix.ipv6Prefix)

    console.log(`✅ Fetched ${ipv4Ranges.length} IPv4 ranges`)
    console.log(`✅ Fetched ${ipv6Ranges.length} IPv6 ranges`)

    return { ipv4Ranges, ipv6Ranges }
  }
  catch (error) {
    console.error('❌ Error fetching Google IP ranges:', error)
    throw error
  }
}

function generateTypeScriptFile(ipv4Ranges, ipv6Ranges) {
  const currentDate = new Date().toISOString().split('T')[0]

  const content = `/**
 * Google IP 地址段和 User-Agent 数据
 * 数据来源: https://developers.google.com/search/apis/ipranges/googlebot.json
 * 最后更新: ${currentDate}
 *
 * ⚠️ 此文件由脚本自动生成，请勿手动编辑
 * 更新命令: node scripts/update-google-ips.mjs
 */

/**
 * Googlebot IPv4 地址段
 * 建议每月更新一次
 */
export const GOOGLEBOT_IPV4_RANGES = [
${ipv4Ranges.map(range => `  '${range}',`).join('\n')}
]

/**
 * Googlebot IPv6 地址段
 * 建议每月更新一次
 */
export const GOOGLEBOT_IPV6_RANGES = [
${ipv6Ranges.map(range => `  '${range}',`).join('\n')}
]

/**
 * 向后兼容：默认使用 IPv4 地址段
 */
export const GOOGLEBOT_IP_RANGES = GOOGLEBOT_IPV4_RANGES

/**
 * Google User-Agent 关键词列表
 * 匹配时不区分大小写
 */
export const GOOGLE_USER_AGENTS = [
  'Googlebot', // 主要搜索爬虫
  'Googlebot-Image', // 图片爬虫
  'Googlebot-News', // 新闻爬虫
  'Googlebot-Video', // 视频爬虫
  'AdsBot-Google', // 广告审核机器人
  'AdsBot-Google-Mobile', // 移动广告审核
  'Mediapartners-Google', // AdSense 爬虫
  'Google-InspectionTool', // 页面检查工具
  'GoogleOther', // 其他 Google 服务
  'Google-Extended', // AI 训练爬虫
  'Storebot-Google', // 商店爬虫
  'Google-Site-Verification', // 网站验证
  'Google-Read-Aloud', // 朗读功能
  'DuplexWeb-Google', // Duplex 网络爬虫
  'FeedFetcher-Google', // Feed 抓取
]

/**
 * 按类型分类的 User-Agent
 */
export const GOOGLE_BOT_TYPES = {
  seo: ['Googlebot', 'Googlebot-Image', 'Googlebot-News', 'Googlebot-Video'],
  ads: ['AdsBot-Google', 'AdsBot-Google-Mobile', 'Mediapartners-Google'],
  tools: ['Google-InspectionTool', 'Google-Site-Verification'],
  ai: ['Google-Extended'],
  other: ['GoogleOther', 'Storebot-Google', 'Google-Read-Aloud', 'DuplexWeb-Google', 'FeedFetcher-Google'],
}

/**
 * 数据更新信息
 */
export const IP_RANGES_METADATA = {
  lastUpdated: '${currentDate}',
  source: '${GOOGLEBOT_API}',
  totalIPv4Ranges: ${ipv4Ranges.length},
  totalIPv6Ranges: ${ipv6Ranges.length},
  totalRanges: ${ipv4Ranges.length + ipv6Ranges.length},
  updateFrequency: 'monthly',
}
`

  return content
}

async function updateGoogleIPRanges() {
  try {
    console.log('🚀 Starting Google IP ranges update...\n')

    // 1. 获取最新 IP 段
    const { ipv4Ranges, ipv6Ranges } = await fetchGoogleIPRanges()

    // 2. 生成 TypeScript 文件内容
    const fileContent = generateTypeScriptFile(ipv4Ranges, ipv6Ranges)

    // 3. 写入文件
    const targetPath = path.join(__dirname, '../lib/google-ip-ranges.ts')
    fs.writeFileSync(targetPath, fileContent, 'utf-8')

    console.log(`\n✅ Successfully updated: ${targetPath}`)
    console.log(`📊 IPv4 ranges: ${ipv4Ranges.length}`)
    console.log(`📊 IPv6 ranges: ${ipv6Ranges.length}`)
    console.log(`📊 Total ranges: ${ipv4Ranges.length + ipv6Ranges.length}`)
    console.log('\n💡 Tip: Commit this change to your repository')
  }
  catch (error) {
    console.error('\n❌ Update failed:', error.message)
    process.exit(1)
  }
}

// 执行更新
updateGoogleIPRanges()
