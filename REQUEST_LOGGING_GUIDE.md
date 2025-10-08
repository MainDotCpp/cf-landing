# 📊 请求日志功能使用指南

## 概述

请求日志功能可以记录所有通过语言过滤器的请求，包括允许访问和被拦截的请求，帮助你：

- 📈 **监控流量**：实时查看网站访问情况
- 🚫 **追踪拦截**：了解哪些用户被语言过滤
- 📊 **统计分析**：按路径、语言分析访问数据
- 💾 **导出数据**：支持导出 CSV 格式

## 🚀 快速开始

### 1. 启用日志记录

在 `middleware.ts` 中，日志记录默认已启用：

```typescript
const CONFIG = {
  enabled: true,
  debug: true,
  logging: true,  // ✅ 日志记录已启用
}
```

### 2. 查看控制台日志（推荐）

启动开发服务器后，日志会实时输出到控制台：

```bash
npm run dev
```

你会看到类似的输出：

```
✅ [ALLOWED] 2025-01-08T12:00:00.000Z | /test-path | User: ja
🚫 [BLOCKED] 2025-01-08T12:01:00.000Z | /test-path | User: en | Allowed: ja
```

### 3. 访问日志页面（可选）

在浏览器中访问：

```
http://localhost:3000/logs
```

**注意：** 在开发环境中，Web 日志页面可能不会显示数据（Next.js 架构限制）。**推荐使用控制台日志**进行开发调试。生产环境中 Web 日志页面会正常工作。

## 🎨 功能特性

### 实时统计

- **总请求数** - 所有请求的总数
- **允许访问** - 语言匹配，正常访问的请求数
- **被拦截** - 语言不匹配，被拦截的请求数
- **拦截率** - 被拦截请求占总请求的百分比

### 路径统计

显示每个路径的访问情况：
- 访问总数
- 拦截次数
- 拦截率

### 语言统计

显示每种语言用户的访问情况：
- 访问总数
- 拦截次数
- 拦截率

### 日志详情

每条日志记录包含：
- ✅/🚫 状态图标（允许/拦截）
- 📍 访问路径
- 🕒 时间戳
- 🌍 用户语言
- 🎯 允许的语言
- 🔍 IP 地址
- 🌐 来源 URL
- 🖥️ User Agent

## 🔧 API 接口

### 获取所有日志

```bash
GET /api/logs?type=all
```

响应：
```json
{
  "total": 100,
  "logs": [
    {
      "timestamp": "2025-01-08T12:00:00.000Z",
      "path": "/test-path",
      "userLanguage": "en",
      "allowedLanguages": "ja",
      "isBlocked": true,
      "userAgent": "Mozilla/5.0...",
      "referer": "https://example.com",
      "ip": "192.168.1.1"
    }
  ]
}
```

### 获取被拦截的日志

```bash
GET /api/logs?type=blocked
```

### 获取允许的日志

```bash
GET /api/logs?type=allowed
```

### 获取统计信息

```bash
GET /api/logs?type=stats
```

响应：
```json
{
  "total": 100,
  "blocked": 30,
  "allowed": 70,
  "blockRate": "30.00%",
  "pathStats": {
    "/test-path": {
      "total": 50,
      "blocked": 20
    }
  },
  "languageStats": {
    "en": {
      "total": 60,
      "blocked": 25
    },
    "ja": {
      "total": 40,
      "blocked": 5
    }
  }
}
```

### 导出 CSV

```bash
GET /api/logs?type=all&format=csv
```

下载包含所有日志的 CSV 文件。

### 清空日志

```bash
DELETE /api/logs
```

## 📝 使用示例

### 示例 1：监控拦截情况

访问 `http://localhost:3000/logs`，查看：
- 有多少用户被拦截
- 哪些路径拦截率最高
- 哪些语言用户被拦截最多

### 示例 2：优化语言策略

根据统计数据调整语言规则：

```typescript
// 如果发现英语用户访问量大，但被拦截率高
// 可以考虑将某些页面开放给英语用户

const SPECIAL_RULES = {
  '/popular-page': ['ja', 'en'],  // 添加英语支持
}
```

### 示例 3：定期导出数据

每周导出 CSV 数据进行长期分析：

1. 访问 `/logs` 页面
2. 点击"导出 CSV"按钮
3. 保存文件到本地
4. 使用 Excel 或其他工具分析

### 示例 4：使用 API 集成

在自己的监控系统中集成：

```javascript
// 每小时获取统计数据
async function getHourlyStats() {
  const response = await fetch('/api/logs?type=stats')
  const stats = await response.json()
  
  // 发送到监控系统
  sendToMonitoring({
    blockRate: stats.blockRate,
    totalRequests: stats.total,
    blockedRequests: stats.blocked,
  })
}
```

## 📊 控制台日志

除了 Web 界面，日志也会输出到控制台：

```bash
✅ [ALLOWED] 2025-01-08T12:00:00.000Z | /test-path | User: ja
🚫 [BLOCKED] 2025-01-08T12:01:00.000Z | /test-path | User: en | Allowed: ja
```

格式说明：
- `✅ [ALLOWED]` - 允许访问
- `🚫 [BLOCKED]` - 被拦截
- 时间戳
- 路径
- 用户语言
- 允许的语言（仅拦截时显示）

## ⚙️ 配置选项

### 禁用日志记录

如果不需要日志功能，可以在 `middleware.ts` 中禁用：

```typescript
const CONFIG = {
  enabled: true,
  debug: true,
  logging: false,  // ❌ 禁用日志记录
}
```

### 调整日志数量限制

默认保存最近 1000 条日志。要修改限制，编辑 `lib/request-logger.ts`：

```typescript
class RequestLogger {
  private readonly maxLogs = 5000  // 修改为 5000 条
  // ...
}
```

## 🎯 最佳实践

### 1. 开发环境

✅ 启用日志记录和调试模式：

```typescript
const CONFIG = {
  enabled: true,
  debug: true,
  logging: true,
}
```

### 2. 生产环境

根据需求决定：

**方案 A：完全记录**
```typescript
const CONFIG = {
  enabled: true,
  debug: false,  // 不输出调试 headers
  logging: true,  // 保留日志记录
}
```

**方案 B：关闭日志**
```typescript
const CONFIG = {
  enabled: true,
  debug: false,
  logging: false,  // 关闭日志以提升性能
}
```

### 3. 定期清理

日志会占用内存，建议：
- 每天或每周清空一次日志
- 在清空前导出重要数据
- 或者使用外部日志系统（如文件、数据库）

### 4. 隐私保护

日志包含 IP、User Agent 等信息：
- 确保符合隐私政策
- 生产环境考虑脱敏处理
- 定期清理旧日志

## 🔍 故障排查

### 问题 1：日志页面显示为空

**解决方案：**
1. 检查 `CONFIG.logging` 是否为 `true`
2. 确保有请求经过中间件（访问网站页面）
3. 检查浏览器控制台是否有错误

### 问题 2：日志不更新

**解决方案：**
1. 刷新页面（日志每 5 秒自动刷新）
2. 检查网络请求是否成功
3. 查看浏览器控制台错误

### 问题 3：导出 CSV 失败

**解决方案：**
1. 检查浏览器是否阻止下载
2. 确保有日志数据
3. 查看 API 响应是否正常

## 📈 性能影响

日志功能对性能的影响：

- **内存使用**：每 1000 条日志约占用 ~200KB 内存
- **CPU 开销**：日志记录操作非常轻量，几乎可忽略
- **建议**：
  - 开发环境：完全启用
  - 生产环境：根据流量决定
  - 高流量网站：考虑使用专业日志系统

## 🎉 总结

请求日志功能让你可以：

✅ **实时监控** - 了解网站访问情况  
✅ **数据分析** - 按路径、语言统计访问  
✅ **优化策略** - 根据数据调整语言规则  
✅ **导出数据** - 支持 CSV 格式长期分析  
✅ **易于使用** - 简洁的 Web 界面  

---

**访问 http://localhost:3000/logs 开始使用！** 📊

