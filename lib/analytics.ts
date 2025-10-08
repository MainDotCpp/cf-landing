/**
 * 谷歌分析事件跟踪
 */

// 声明全局 gtag 函数
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

/**
 * 发送谷歌分析事件
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>,
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }

  // 也可以推送到 dataLayer（兼容 GTM）
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    })
  }

  // 开发环境下打印日志
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, params)
  }
}

/**
 * 跟踪 CTA 点击
 */
export function trackCtaClick(
  ctaType: 'primary' | 'secondary',
  url: string,
  label?: string,
) {
  trackEvent('cta_click', {
    cta_type: ctaType,
    cta_url: url,
    cta_label: label,
    page_path: window.location.pathname,
  })
}

/**
 * 跟踪页面浏览
 */
export function trackPageView(url: string) {
  trackEvent('page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  })
}

/**
 * 跟踪表单提交
 */
export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent('form_submit', {
    form_name: formName,
    success,
  })
}
