# 🌐 语言过滤功能使用指南

## 📖 功能概述

本系统实现了基于用户语言的智能页面过滤功能：
- 通过中间件检测用户浏览器语言
- 如果语言不匹配配置，自动 **内部渲染** 为首页（URL 不变）
- 不会有重定向闪烁，用户体验更好
- 在中间件中全局配置，简单高效

## 🎯 核心特性

### 1. **无感知切换**
- URL 保持不变
- 使用 Next.js `rewrite` 而非 `redirect`
- 对 SEO 友好

### 2. **全局配置**
- 在 `middleware.ts` 中集中管理所有路径的语言规则
- 无需数据库，配置简单直观
- 支持环境变量开关

### 3. **智能检测**
- 基于浏览器 `Accept-Language` header
- 支持常见语言代码及其变体
- 标准化处理（如 zh-CN → zh）

## 🛠️ 配置方法

### 步骤 1：编辑中间件配置

打开 `middleware.ts` 文件，找到 `LANGUAGE_RULES` 配置对象：

```typescript
const LANGUAGE_RULES: Record<string, SupportedLanguage[] | 'all'> = {
  // 示例配置：
  '/jp-exclusive': ['ja'],           // 仅日语用户可访问
  '/en-exclusive': ['en'],           // 仅英语用户可访问
  '/asia': ['ja', 'zh', 'ko'],      // 亚洲语言用户可访问
  '/': 'all',                        // 首页所有人可访问
  
  // 👇 在这里添加你的路径语言规则
  '/your-path': ['ja', 'en'],
}
```

### 步骤 2：添加语言规则

**语法：**
```typescript
'/path': 'all'              // 允许所有语言
'/path': ['ja']             // 仅日语
'/path': ['ja', 'en']       // 日语和英语
'/path': ['ja', 'zh', 'ko'] // 日、中、韩
```

**完整示例：**
```typescript
const LANGUAGE_RULES: Record<string, SupportedLanguage[] | 'all'> = {
  // 日本市场专属页面
  '/jp-campaign': ['ja'],
  '/jp-products': ['ja'],
  
  // 亚洲市场页面
  '/asia-market': ['ja', 'zh', 'ko'],
  
  // 国际页面
  '/global': 'all',
  '/contact': 'all',
  
  // 英文页面
  '/en-about': ['en'],
}
```

### 步骤 3：保存并重启

保存文件后，开发服务器会自动重新编译中间件，配置立即生效。

### 步骤 4：测试效果

#### 方法 1：使用 curl 测试（推荐）

```bash
# 测试日语用户访问日语专属页面（应该正常显示）
curl -I -H "Accept-Language: ja-JP,ja;q=0.9" http://localhost:3000/jp-exclusive

# 测试英语用户访问日语专属页面（应该显示首页内容）
curl -I -H "Accept-Language: en-US,en;q=0.9" http://localhost:3000/jp-exclusive

# 查看调试 Headers（开发环境）
curl -I -H "Accept-Language: en-US,en;q=0.9" http://localhost:3000/jp-exclusive | grep "x-"
```

**预期结果：**
- 语言匹配：正常显示页面内容
- 语言不匹配：显示首页内容，但 URL 不变
- 开发环境会有额外的调试 headers：
  - `x-language-mismatch: true`
  - `x-user-language: en`
  - `x-allowed-languages: ja`
  - `x-original-path: /jp-exclusive`

#### 方法 2：修改浏览器语言

**Chrome:**
1. 设置 → 语言 → 添加语言
2. 将目标语言移到顶部
3. 重启浏览器并访问页面

**Firefox:**
1. 首选项 → 语言 → 选择要添加的语言
2. 调整语言顺序
3. 刷新页面

## 🏗️ 技术架构

### 工作流程图

```
用户请求 → middleware.ts
              ↓
         查找 LANGUAGE_RULES
              ↓
    检测用户语言 vs 规则
              ↓
        ┌─────┴─────┐
        ↓           ↓
      匹配        不匹配
        ↓           ↓
    正常显示   rewrite 到首页
               (URL 不变)
```

### 关键文件

| 文件 | 作用 |
|------|------|
| `middleware.ts` | **核心文件**：语言规则配置 + 检测逻辑 |
| `lib/language.ts` | 语言检测和匹配工具函数 |

### 配置结构

中间件中的配置对象：

```typescript
// middleware.ts
const LANGUAGE_RULES: Record<string, SupportedLanguage[] | 'all'> = {
  '/path': ['ja', 'en'],  // 路径 → 允许的语言列表
}

const CONFIG = {
  enabled: true,           // 是否启用功能
  defaultRule: 'all',      // 未配置路径的默认规则
  debug: true,             // 是否输出调试信息
}
```

## 💡 配置示例

### 示例 1：日本专属落地页

在 `middleware.ts` 中配置：

```typescript
const LANGUAGE_RULES = {
  '/jp-exclusive': ['ja'],
}
```

**效果：**
- 日语用户访问 `/jp-exclusive`：✅ 正常显示页面内容
- 英语用户访问 `/jp-exclusive`：🔄 显示首页内容（URL 仍为 `/jp-exclusive`）

### 示例 2：亚洲市场页面

```typescript
const LANGUAGE_RULES = {
  '/asia-campaign': ['ja', 'zh', 'ko'],
  '/asia-products': ['ja', 'zh', 'ko'],
}
```

**效果：**
- 日/中/韩用户：✅ 正常显示
- 英语/其他用户：🔄 显示首页

### 示例 3：多区域营销

```typescript
const LANGUAGE_RULES = {
  // 日本市场
  '/jp-special': ['ja'],
  '/jp-sale': ['ja'],
  
  // 英文市场
  '/en-products': ['en'],
  '/en-about': ['en'],
  
  // 全球通用
  '/contact': 'all',
  '/privacy': 'all',
  '/': 'all',
}
```

## 🔍 调试信息

开发环境下，中间件会在响应 header 中添加调试信息（生产环境自动关闭）：

```bash
curl -I -H "Accept-Language: en-US" http://localhost:3000/jp-exclusive
```

**响应 Headers：**
```
x-language-mismatch: true        // 语言不匹配
x-user-language: en              // 用户的语言
x-allowed-languages: ja          // 该路径允许的语言
x-original-path: /jp-exclusive   // 原始请求路径
```

在浏览器中查看：
- DevTools → Network → 选择请求 → Headers → Response Headers

## 🚀 高级配置

### 1. 通过环境变量控制

在 `.env.local` 中添加：

```bash
# 禁用语言过滤功能
NEXT_PUBLIC_ENABLE_LANGUAGE_FILTER=false
```

这样可以在不修改代码的情况下临时关闭语言过滤。

### 2. 修改默认规则

如果你希望未配置的路径默认拒绝所有语言（或只允许特定语言）：

```typescript
const CONFIG = {
  enabled: true,
  defaultRule: ['ja', 'en'],  // 未配置路径只允许日语和英语
  debug: true,
}
```

### 3. 动态规则（高级）

如果需要根据其他条件动态决定语言规则：

```typescript
export async function middleware(request: NextRequest) {
  // ... 现有代码 ...
  
  // 动态规则示例
  let rule = LANGUAGE_RULES[path] ?? CONFIG.defaultRule
  
  // 根据时间、用户、AB测试等条件调整规则
  if (path === '/campaign' && isSpecialEvent()) {
    rule = ['ja']  // 特殊活动期间只允许日语
  }
  
  // 继续后续逻辑...
}
```

### 4. 自定义语言映射

如果需要将某些语言映射为其他语言，编辑 `lib/language.ts`：

```typescript
export const LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  // 将葡萄牙语和西班牙语视为英语
  'pt': 'en',
  'es': 'en',
  'pt-br': 'en',
  'es-mx': 'en',
}
```

### 5. 添加新语言支持

在 `lib/language.ts` 中：

```typescript
export type SupportedLanguage = 'ja' | 'en' | 'zh' | 'ko' | 'fr' | 'de' | 'all'

export const LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  // ... 现有映射 ...
  
  // 添加法语
  fr: 'fr',
  'fr-fr': 'fr',
  'fr-ca': 'fr',
  
  // 添加德语
  de: 'de',
  'de-de': 'de',
}
```

然后在 `middleware.ts` 中就可以使用：

```typescript
const LANGUAGE_RULES = {
  '/fr-campaign': ['fr'],
  '/de-products': ['de'],
}
```

## ⚠️ 注意事项

### 1. 中间件性能

- 中间件在每个请求时都会运行
- 已自动跳过静态资源（`/_next`、图片等）和 API 路由
- 语言检测逻辑非常轻量，不会影响性能

### 2. SEO 影响

- ✅ URL 不变，对 SEO 友好
- ⚠️ 搜索引擎爬虫可能会看到首页内容（如果爬虫语言不匹配）
- 💡 建议：为需要 SEO 的页面配置 `'all'`，仅对营销落地页使用语言限制

### 3. 缓存注意

- CDN 和浏览器缓存可能会忽略 `Accept-Language` header
- 建议为有语言限制的页面设置 `Vary: Accept-Language`

### 4. 本地测试

推荐使用 curl 测试：

```bash
# 快速测试脚本
test_lang() {
  echo "Testing $1 with $2 language:"
  curl -I -H "Accept-Language: $2" http://localhost:3000$1 2>&1 | grep -E "(HTTP|x-)"
  echo ""
}

test_lang "/jp-exclusive" "ja-JP,ja;q=0.9"
test_lang "/jp-exclusive" "en-US,en;q=0.9"
```

## 📊 实际应用场景

### 场景 1：区域限定营销活动

日本市场专属活动页面：

```typescript
// middleware.ts
const LANGUAGE_RULES = {
  '/japan-summer-sale': ['ja'],
  '/japan-new-product': ['ja'],
}
```

**效果：**
- 日语用户：看到专为日本市场设计的活动页面
- 其他用户：看到通用首页，避免混淆

### 场景 2：多区域产品介绍

不同区域有不同的产品版本或定价：

```typescript
const LANGUAGE_RULES = {
  '/product-asia': ['ja', 'zh', 'ko'],
  '/product-europe': ['en', 'de', 'fr'],
  '/product-americas': ['en', 'es'],
  '/product-global': 'all',
}
```

**效果：**根据用户语言自动过滤，确保用户看到适合其市场的内容。

### 场景 3：AB 测试和灰度发布

针对特定语言用户进行新功能测试：

```typescript
const LANGUAGE_RULES = {
  '/beta-features': ['ja'],  // 先在日本市场测试
  '/experimental': ['en'],   // 英文用户灰度
}
```

### 场景 4：合规和法律要求

某些内容受地区法律限制：

```typescript
const LANGUAGE_RULES = {
  '/adult-content': ['ja'],     // 仅日本市场
  '/financial-advice': ['en'],  // 仅英文市场合规内容
}
```

## 🎉 总结

### ✅ 优势

- **简单配置**：在一个文件中管理所有语言规则
- **性能优秀**：中间件层面处理，无需数据库查询
- **URL 友好**：保持 URL 不变，对 SEO 有利
- **灵活控制**：支持环境变量、动态规则等高级用法
- **易于调试**：开发环境自动输出调试信息

### 🚀 快速开始

1. 编辑 `middleware.ts` 中的 `LANGUAGE_RULES`
2. 保存文件，服务器自动重新编译
3. 使用 curl 或修改浏览器语言测试
4. 查看响应 headers 中的调试信息

### 📝 最佳实践

1. **营销页面**：使用语言限制
2. **SEO 重要页面**：设置为 `'all'`
3. **测试先行**：使用 curl 验证配置
4. **文档同步**：在代码中添加注释说明每个规则的用途

如有问题，请查看 `middleware.ts` 和 `lib/language.ts` 中的注释。

