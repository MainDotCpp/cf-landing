/**
 * Google IP 地址段和 User-Agent 数据
 * 数据来源: https://www.gstatic.com/ipranges/goog.json
 * 最后更新: 2025-10-09
 * Sync Token: 1760018684521
 *
 * ⚠️ 此文件由脚本自动生成，请勿手动编辑
 * 更新命令: node scripts/update-google-ips.mjs
 *
 * 注意：此数据源包含所有 Google 服务的 IP 地址段
 * 包括：Googlebot、Google Cloud、Google DNS、AdWords 等
 */

/**
 * Google IPv4 地址段（所有 Google 服务）
 * 建议每月更新一次
 */
export const GOOGLEBOT_IPV4_RANGES = [
  '8.8.4.0/24',
  '8.8.8.0/24',
  '8.34.208.0/20',
  '8.35.192.0/20',
  '8.228.0.0/14',
  '8.232.0.0/14',
  '8.236.0.0/15',
  '23.236.48.0/20',
  '23.251.128.0/19',
  '34.0.0.0/15',
  '34.2.0.0/16',
  '34.3.0.0/23',
  '34.3.3.0/24',
  '34.3.4.0/24',
  '34.3.8.0/21',
  '34.3.16.0/20',
  '34.3.32.0/19',
  '34.3.64.0/18',
  '34.4.0.0/14',
  '34.8.0.0/13',
  '34.16.0.0/12',
  '34.32.0.0/11',
  '34.64.0.0/10',
  '34.128.0.0/10',
  '35.184.0.0/13',
  '35.192.0.0/14',
  '35.196.0.0/15',
  '35.198.0.0/16',
  '35.199.0.0/17',
  '35.199.128.0/18',
  '35.200.0.0/13',
  '35.208.0.0/12',
  '35.224.0.0/12',
  '35.240.0.0/13',
  '35.252.0.0/14',
  '64.15.112.0/20',
  '64.233.160.0/19',
  '66.102.0.0/20',
  '66.249.64.0/19',
  '70.32.128.0/19',
  '72.14.192.0/18',
  '74.114.24.0/21',
  '74.125.0.0/16',
  '104.154.0.0/15',
  '104.196.0.0/14',
  '104.237.160.0/19',
  '107.167.160.0/19',
  '107.178.192.0/18',
  '108.59.80.0/20',
  '108.170.192.0/18',
  '108.177.0.0/17',
  '130.211.0.0/16',
  '136.22.2.0/23',
  '136.22.4.0/23',
  '136.22.8.0/22',
  '136.22.160.0/20',
  '136.22.176.0/21',
  '136.22.184.0/23',
  '136.22.186.0/24',
  '136.23.48.0/20',
  '136.23.64.0/18',
  '136.64.0.0/11',
  '136.107.0.0/16',
  '136.108.0.0/14',
  '136.112.0.0/13',
  '136.120.0.0/22',
  '136.124.0.0/15',
  '142.250.0.0/15',
  '146.148.0.0/17',
  '162.120.128.0/17',
  '162.216.148.0/22',
  '162.222.176.0/21',
  '172.110.32.0/21',
  '172.217.0.0/16',
  '172.253.0.0/16',
  '173.194.0.0/16',
  '173.255.112.0/20',
  '192.104.160.0/23',
  '192.158.28.0/22',
  '192.178.0.0/15',
  '193.186.4.0/24',
  '199.36.154.0/23',
  '199.36.156.0/24',
  '199.192.112.0/22',
  '199.223.232.0/21',
  '207.175.0.0/16',
  '207.223.160.0/20',
  '208.65.152.0/22',
  '208.68.108.0/22',
  '208.81.188.0/22',
  '208.117.224.0/19',
  '209.85.128.0/17',
  '216.58.192.0/19',
  '216.73.80.0/20',
  '216.239.32.0/19',
  '216.252.220.0/22',
]

/**
 * Google IPv6 地址段（所有 Google 服务）
 * 建议每月更新一次
 */
export const GOOGLEBOT_IPV6_RANGES = [
  '2001:4860::/32',
  '2404:6800::/32',
  '2404:f340::/32',
  '2600:1900::/28',
  '2605:ef80::/32',
  '2606:40::/32',
  '2606:73c0::/32',
  '2607:1c0:241:40::/60',
  '2607:1c0:300::/40',
  '2607:f8b0::/32',
  '2620:11a:a000::/40',
  '2620:120:e000::/40',
  '2800:3f0::/32',
  '2a00:1450::/32',
  '2c0f:fb50::/32',
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
  source: 'https://www.gstatic.com/ipranges/goog.json',
  syncToken: '1760018684521',
  creationTime: '2025-10-09T07:04:44.521631',
  lastUpdated: '2025-10-09',
  totalIPv4Ranges: 96,
  totalIPv6Ranges: 15,
  totalRanges: 111,
  updateFrequency: 'monthly',
  note: 'Includes all Google services (Googlebot, Cloud, DNS, etc.)',
}
