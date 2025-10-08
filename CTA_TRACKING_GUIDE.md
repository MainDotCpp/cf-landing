# CTA 按钮跳转和跟踪系统使用指南

## 📚 概述

这个系统为所有落地页按钮提供了统一的跳转逻辑和谷歌分析跟踪，方便维护和扩展。

## 🎯 核心功能

### 1. 自动跳转
- ✅ 支持同窗口跳转
- ✅ 支持新窗口打开
- ✅ 自动处理无效URL（`#` 或空）

### 2. 谷歌分析跟踪
- ✅ 自动上报点击事件到 Google Analytics
- ✅ 自动上报到 Google Tag Manager (dataLayer)
- ✅ 开发环境下控制台打印日志

### 3. 灵活配置
- ✅ 可自定义事件标签
- ✅ 可添加跳转前回调
- ✅ 支持主要/次要两种 CTA 类型

## 📁 文件结构

```
lib/
└── analytics.ts                 # 谷歌分析跟踪函数

components/
├── hooks/
│   └── useCtaLink.ts            # CTA Hook（包含跳转和跟踪）
└── ui/
    └── cta-button.tsx           # CTA 按钮组件（可选）
```

## 🚀 使用方法

### 方法 1: 使用 `useCtaHandler` Hook（推荐）

这是最简单且推荐的方式，适用于大多数场景。

```typescript
import { useCtaHandler } from '@/components/hooks/useCtaLink'
import { Button } from '@/components/ui/button'

export function MyComponent() {
  // 创建主要 CTA 处理函数
  const handlePrimaryClick = useCtaHandler('primary', {
    label: '立即注册',           // 事件标签（用于分析）
    openInNewTab: false,          // 是否新窗口打开（可选）
    onBeforeNavigate: () => {     // 跳转前回调（可选）
      console.log('即将跳转')
    }
  })

  // 创建次要 CTA 处理函数
  const handleSecondaryClick = useCtaHandler('secondary', {
    label: '了解更多',
    openInNewTab: true,           // 新窗口打开
  })

  return (
    <div>
      <Button onClick={handlePrimaryClick}>
        立即注册
      </Button>

      <Button onClick={handleSecondaryClick} variant="outline">
        了解更多
      </Button>
    </div>
  )
}
```

### 方法 2: 使用 `CtaButton` 组件

适合需要更多自定义的场景。

```typescript
import { CtaButton } from '@/components/ui/cta-button'

export function MyComponent() {
  return (
    <div>
      <CtaButton
        href="https://example.com"
        ctaType="primary"
        label="立即注册"
        openInNewTab={false}
        size="lg"
        className="w-full"
      >
        立即注册
      </CtaButton>
    </div>
  )
}
```

### 方法 3: 仅获取URL（不推荐，无跟踪）

如果只需要URL而不需要跟踪（不推荐）。

```typescript
import { useCtaLink } from '@/components/hooks/useCtaLink'

export function MyComponent() {
  const primaryUrl = useCtaLink('primary', '#')

  return <a href={primaryUrl}>链接</a>
}
```

## 📊 谷歌分析事件

### CTA 点击事件

每次点击 CTA 按钮时，会自动发送以下事件：

```javascript
{
  event: 'cta_click',
  cta_type: 'primary' | 'secondary',  // CTA 类型
  cta_url: 'https://...',             // 跳转URL
  cta_label: '立即注册',               // 按钮标签
  page_path: '/landing-page'          // 当前页面路径
}
```

### 在 Google Analytics 中查看

1. 打开 Google Analytics
2. 进入「事件」报告
3. 搜索 `cta_click` 事件
4. 可以看到：
   - 哪个按钮被点击最多（`cta_label`）
   - 哪种类型的 CTA 效果更好（`cta_type`）
   - 哪个页面的转化率最高（`page_path`）

## 🎨 实际案例

### 案例 1: Hero 区域主按钮

```typescript
// components/hero-section.tsx
export function HeroSection() {
  const handlePrimaryClick = useCtaHandler('primary', {
    label: 'Hero - 今すぐ友達追加',
  })

  return (
    <Button onClick={handlePrimaryClick} size="lg">
      <Zap className="mr-2" />
      今すぐ友達追加
    </Button>
  )
}
```

### 案例 2: CTA 区域多个按钮

```typescript
// components/call-to-action.tsx
export function CallToAction() {
  const handlePrimaryClick = useCtaHandler('primary', {
    label: 'CTA Section - 今すぐ友達追加',
  })

  return (
    <Button onClick={handlePrimaryClick}>
      今すぐ友達追加
    </Button>
  )
}
```

### 案例 3: 需要确认的按钮

```typescript
export function DangerButton() {
  const handleClick = useCtaHandler('primary', {
    label: '删除账户',
    onBeforeNavigate: () => {
      if (!confirm('确定要删除吗？')) {
        return  // 阻止跳转
      }
    }
  })

  return (
    <Button onClick={handleClick} variant="destructive">
      删除账户
    </Button>
  )
}
```

## 🔧 高级用法

### 自定义跟踪事件

除了 CTA 点击，还可以跟踪其他事件：

```typescript
import { trackEvent, trackFormSubmit, trackPageView } from '@/lib/analytics'

// 跟踪表单提交
trackFormSubmit('contact_form', true)

// 跟踪页面浏览
trackPageView('/thank-you')

// 跟踪自定义事件
trackEvent('video_play', {
  video_title: '股票教程',
  video_duration: 120,
})
```

### 配置 Google Analytics

在 `app/layout.tsx` 或自定义的分析组件中添加 GA 脚本：

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

## 📈 数据库配置

CTA URL 在数据库中配置：

```sql
-- UrlConfig 表
UPDATE UrlConfig
SET ctas = '{"primary": "https://line.me/xxx", "secondary": "#"}'
WHERE host = 'example.com' AND path = '/';
```

通过配置页面 `?config=1` 也可以可视化配置。

## ✅ 最佳实践

### 1. 使用语义化的标签
```typescript
// ❌ 不好
label: '按钮1'

// ✅ 好
label: 'Hero Section - 注册按钮'
```

### 2. 区分不同位置的相同按钮
```typescript
// ✅ 方便分析不同位置的转化率
label: 'Header - 立即注册'
label: 'Hero - 立即注册'
label: 'Footer - 立即注册'
```

### 3. 为外部链接使用新窗口
```typescript
// ✅ 外部链接建议新窗口打开
useCtaHandler('primary', {
  openInNewTab: true, // 保留用户在网站上
})
```

### 4. 开发时检查日志
在开发环境下，打开控制台可以看到所有跟踪事件：
```
[Analytics] cta_click {
  cta_type: 'primary',
  cta_url: 'https://...',
  cta_label: '...',
  page_path: '...'
}
```

## 🚨 注意事项

1. **确保 URL 有效**：无效的 URL（`#` 或空）会阻止跳转并在控制台显示警告
2. **不要混用方法**：建议统一使用 `useCtaHandler`，避免部分按钮有跟踪，部分没有
3. **测试跟踪**：在 GA 实时报告中测试跟踪是否正常工作
4. **GDPR 合规**：如果面向欧盟用户，需要添加 Cookie 同意横幅

## 📦 迁移指南

### 从旧的 `<Link>` 组件迁移

**之前：**
```typescript
import Link from 'next/link'
import { useCtaLink } from '@/components/hooks/useCtaLink'

const primaryLink = useCtaLink('primary')

<Link href={primaryLink}>
  <Button asChild>点击我</Button>
</Link>
```

**之后：**
```typescript
import { useCtaHandler } from '@/components/hooks/useCtaLink'

const handleClick = useCtaHandler('primary', {
  label: '点击我'
})

<Button onClick={handleClick}>点击我</Button>
```

## 🎉 总结

这个系统提供了：
- ✅ 统一的跳转逻辑
- ✅ 自动的谷歌分析跟踪
- ✅ 易于维护和扩展
- ✅ 类型安全的 API
- ✅ 灵活的配置选项

所有落地页按钮都应该使用这个系统，确保数据的一致性和完整性！
