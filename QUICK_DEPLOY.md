# ⚡ 快速部署指南

## 🎯 最快部署方案

### 方案 1️⃣：Cloudflare Pages（推荐）

**总耗时：~5 分钟**

```bash
# 1. 登录 Cloudflare（首次）
wrangler login

# 2. 配置数据库连接
# 创建 .env 文件（如果还没有）
echo 'DATABASE_URL="你的PostgreSQL连接字符串"' > .env

# 3. 生成 Prisma Client
npm run prisma:generate

# 4. 部署！
npm run deploy
```

**完成！** 访问 `https://你的项目名.pages.dev`

---

### 方案 2️⃣：Vercel（最简单）

**总耗时：~3 分钟**

```bash
# 1. 安装 Vercel CLI（首次）
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 生产部署
vercel --prod
```

在部署过程中会提示配置 `DATABASE_URL`，直接输入即可。

**完成！** Vercel 会给你一个访问链接

---

## 🗄️ 快速配置数据库

### 选择 1：Supabase（推荐，免费 500MB）

1. 访问 https://supabase.com 注册
2. 创建新项目（等待 2 分钟初始化）
3. 复制连接字符串：
   - 进入 **Project Settings** → **Database**
   - 复制 **Connection string** (URI 格式)
   - 格式：`postgresql://postgres.[项目ID]:[密码]@...`

4. 初始化数据库：
```bash
DATABASE_URL="你的连接字符串" npx prisma db push
```

### 选择 2：Neon（推荐，Serverless）

1. 访问 https://neon.tech 注册
2. 创建项目（立即可用）
3. 复制连接字符串
4. 初始化数据库：
```bash
DATABASE_URL="你的连接字符串" npx prisma db push
```

---

## 🔧 环境变量配置

### Cloudflare Pages

```bash
# 方式 1：使用 wrangler secrets
wrangler secret put DATABASE_URL
# 粘贴你的数据库连接字符串

# 方式 2：在 Dashboard 配置
# https://dash.cloudflare.com → Workers & Pages → 你的项目 → Settings → Environment variables
```

### Vercel

```bash
# 方式 1：CLI 配置
vercel env add DATABASE_URL
# 选择 Production/Preview/Development
# 粘贴连接字符串

# 方式 2：Dashboard 配置
# https://vercel.com → 你的项目 → Settings → Environment Variables
```

---

## ✅ 部署检查

部署后访问以下 URL 确认功能正常：

```bash
# 主页
https://你的域名/

# 配置页面
https://你的域名/?config=1

# 日志页面
https://你的域名/logs

# API 测试
https://你的域名/api/config?path=/
```

---

## 🐛 快速排错

### 错误：Prisma Client not found

```bash
npm run prisma:generate
```

### 错误：Database connection failed

检查 `DATABASE_URL` 格式：
```bash
# ✅ 正确
postgresql://user:password@host:5432/dbname

# ❌ 错误（缺少端口）
postgresql://user:password@host/dbname
```

### 错误：Build timeout

```bash
# Cloudflare
wrangler pages deploy --timeout 600

# Vercel
vercel --timeout 600
```

---

## 🚀 一键部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 开始部署..."

# 检查环境变量
if [ -z "$DATABASE_URL" ]; then
    echo "❌ 错误：DATABASE_URL 未设置"
    exit 1
fi

# 生成 Prisma Client
echo "📦 生成 Prisma Client..."
npm run prisma:generate

# 推送数据库结构
echo "🗄️ 初始化数据库..."
npx prisma db push --accept-data-loss

# 部署到 Cloudflare
echo "☁️ 部署到 Cloudflare Pages..."
npm run deploy

echo "✅ 部署完成！"
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 部署对比

| 平台 | 部署速度 | 难度 | 免费额度 | 推荐度 |
|------|---------|------|---------|--------|
| **Cloudflare Pages** | ⚡⚡⚡ | 简单 | 无限制 | ⭐⭐⭐⭐⭐ |
| **Vercel** | ⚡⚡⚡⚡ | 最简单 | 100GB/月 | ⭐⭐⭐⭐ |
| **Docker** | ⚡ | 复杂 | 看服务器 | ⭐⭐⭐ |

---

**需要详细文档？** 查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**准备好了吗？** 选择一个方案，开始部署吧！🚀

