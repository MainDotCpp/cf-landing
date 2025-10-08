/**
 * 语言检测和匹配工具
 */

export type SupportedLanguage = 'ja' | 'en' | 'zh' | 'ko' | 'all'

/**
 * 获取浏览器语言
 */
export function getBrowserLanguage(): string {
  if (typeof window === 'undefined')
    return 'en'

  const lang = navigator.language || (navigator as any).userLanguage
  return lang.toLowerCase().split('-')[0] // 'en-US' -> 'en'
}

/**
 * 从请求头获取语言
 */
export function getLanguageFromHeaders(acceptLanguage: string | null): string {
  if (!acceptLanguage)
    return 'en'

  // Accept-Language: en-US,en;q=0.9,ja;q=0.8
  const languages = acceptLanguage.split(',')
  const primaryLang = languages[0].split(';')[0].split('-')[0]
  return primaryLang.toLowerCase()
}

/**
 * 检查语言是否匹配
 */
export function isLanguageMatch(
  userLang: string,
  allowedLangs: SupportedLanguage[] | string[],
): boolean {
  // 如果允许所有语言
  if (allowedLangs.includes('all')) {
    return true
  }

  // 检查用户语言是否在允许列表中
  return allowedLangs.includes(userLang as SupportedLanguage)
}

/**
 * 获取语言的友好名称
 */
export function getLanguageName(lang: string): string {
  const names: Record<string, string> = {
    ja: '日本語',
    en: 'English',
    zh: '中文',
    ko: '한국어',
    all: 'すべての言語',
  }
  return names[lang] || lang
}

/**
 * 语言映射表（浏览器语言码 -> 标准语言码）
 */
export const LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  // 日语
  'ja': 'ja',
  'jp': 'ja',
  'jpn': 'ja',

  // 英语
  'en': 'en',
  'eng': 'en',

  // 中文
  'zh': 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  'cmn': 'zh',

  // 韩语
  'ko': 'ko',
  'kor': 'ko',
}

/**
 * 标准化语言代码
 */
export function normalizeLanguage(lang: string): SupportedLanguage {
  const normalized = lang.toLowerCase()
  return LANGUAGE_MAP[normalized] || 'en'
}
