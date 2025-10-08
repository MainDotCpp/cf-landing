// URL 配置类型定义
export interface UrlConfig {
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

// 页面信息类型
export interface PageInfo {
  path: string
  name: string
  location: string
}

