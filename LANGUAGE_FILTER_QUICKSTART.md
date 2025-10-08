# 🚀 语言过滤功能 - 快速开始

## 2分钟极简配置

### 1. 编辑中间件配置 (middleware.ts)

打开 `middleware.ts`，找到 `LANGUAGE_CONFIG` 对象：

```typescript
const LANGUAGE_CONFIG = {
  // 首页的语言规则
  homePage: 'all',
  
  // 除首页外，所有其他路径的语言规则
  otherPages: ['ja'],  // 👈 修改这里！仅允许日语用户访问
}
```

**就这么简单！** 一行配置搞定所有页面。

### 2. 保存文件

保存后，Next.js 开发服务器会自动重新编译中间件。

### 3. 测试

```bash
# 测试日语用户访问日语页面（✅ 正常显示）
curl -I -H "Accept-Language: ja-JP" http://localhost:3000/jp-campaign

# 测试英语用户访问日语页面（🔄 显示首页，URL不变）
curl -I -H "Accept-Language: en-US" http://localhost:3000/jp-campaign

# 查看调试信息
curl -I -H "Accept-Language: en-US" http://localhost:3000/jp-campaign | grep "x-"
```

### 4. 查看调试信息

语言不匹配时，响应headers会包含：

```
x-language-mismatch: true        # 语言不匹配标记
x-user-language: en              # 用户的语言
x-allowed-languages: ja          # 该路径允许的语言
x-original-path: /jp-campaign    # 原始请求路径
x-middleware-rewrite: /          # 实际渲染的路径（首页）
```

## 配置选项

### 基础配置

```typescript
const LANGUAGE_CONFIG = {
  homePage: 'all',        // 首页：允许所有语言
  otherPages: 'all',      // 其他页面：允许所有语言（默认）
}
```

### 常用配置示例

```typescript
// 示例 1：仅日语用户可访问所有页面（除首页）
const LANGUAGE_CONFIG = {
  homePage: 'all',
  otherPages: ['ja'],
}

// 示例 2：亚洲语言用户可访问
const LANGUAGE_CONFIG = {
  homePage: 'all',
  otherPages: ['ja', 'zh', 'ko'],
}

// 示例 3：首页也限制语言
const LANGUAGE_CONFIG = {
  homePage: ['ja'],      // 首页也只允许日语
  otherPages: ['ja'],
}
```

### 特殊路径配置（可选）

如果某些路径需要不同的规则，使用 `SPECIAL_RULES`：

```typescript
const SPECIAL_RULES = {
  '/contact': 'all',      // 联系页面允许所有语言
  '/vip': ['ja', 'en'],   // VIP 页面允许日语和英语
}
```

### 系统配置

```typescript
const CONFIG = {
  enabled: true,   // 启用/禁用语言过滤
  debug: true,     // 是否输出调试headers
}
```

## 支持的语言

- `'all'` - 所有语言
- `['ja']` - 日本語 🇯🇵
- `['en']` - English 🇺🇸
- `['zh']` - 中文 🇨🇳
- `['ko']` - 한국어 🇰🇷

可以组合使用：`['ja', 'en', 'zh']`

## 工作原理

```
用户请求 /jp-campaign
    ↓
检测浏览器语言：英语
    ↓
查找规则：仅允许日语
    ↓
语言不匹配
    ↓
内部 rewrite 到首页
    ↓
URL 仍然是 /jp-campaign
内容显示为首页
```

## 常见用例

### 1. 日本市场落地页

所有页面（除首页）仅允许日语用户访问：

```typescript
const LANGUAGE_CONFIG = {
  homePage: 'all',      // 首页开放
  otherPages: ['ja'],   // 其他页面仅日语
}
```

### 2. 亚洲市场营销

所有页面针对亚洲市场（日中韩）：

```typescript
const LANGUAGE_CONFIG = {
  homePage: 'all',
  otherPages: ['ja', 'zh', 'ko'],
}
```

### 3. 特定页面例外

大部分页面限制日语，但联系页面开放：

```typescript
const LANGUAGE_CONFIG = {
  homePage: 'all',
  otherPages: ['ja'],
}

const SPECIAL_RULES = {
  '/contact': 'all',    // 联系页面例外，允许所有语言
  '/privacy': 'all',    // 隐私政策也开放
}
```

## 故障排除

### 语言过滤不生效？

1. 检查 `CONFIG.enabled` 是否为 `true`
2. 确认 `LANGUAGE_RULES` 中有该路径的配置
3. 查看响应 headers 中的 `x-` 开头的调试信息
4. 确认浏览器发送的 `Accept-Language` header

### 如何查看用户的语言？

```bash
curl -I -H "Accept-Language: YOUR-LANG" http://localhost:3000/path | grep "x-user-language"
```

### 如何临时禁用？

在 `middleware.ts` 中：

```typescript
const CONFIG = {
  enabled: false,  // 禁用所有语言过滤
  // ...
}
```

## 生产环境注意事项

1. **关闭调试信息**：将 `CONFIG.debug` 设为 `false`
2. **CDN 缓存**：确保 CDN 考虑 `Accept-Language` header
3. **SEO**：重要页面建议设置为 `'all'`，仅对营销页面使用语言限制

## 更多信息

完整文档请查看：[LANGUAGE_FILTER_GUIDE.md](./LANGUAGE_FILTER_GUIDE.md)

