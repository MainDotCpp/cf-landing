# 🚀 项目部署指南

本项目支持多种部署方式，推荐使用 **Cloudflare Pages**（项目已配置）。

---

## 📋 目录

1. [Cloudflare Pages 部署（推荐）](#cloudflare-pages-部署推荐)
2. [Vercel 部署（最简单）](#vercel-部署最简单)
3. [传统服务器部署（Docker）](#传统服务器部署docker)
4. [数据库配置](#数据库配置)
5. [环境变量配置](#环境变量配置)

---

## 1️⃣ Cloudflare Pages 部署（推荐）

### ✅ 优势
- ✨ 全球 CDN 加速
- 💰 免费额度慷慨
- ⚡ 边缘计算，响应快
- 🔄 自动 CI/CD
- 🌐 支持 Middleware

### 📦 准备工作

#### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare
```bash
wrangler login
```

### 🚀 部署步骤

#### 方式 A：使用命令行（推荐）

```bash
# 1. 生成 Prisma Client
npm run prisma:generate

# 2. 构建并部署
npm run deploy

# 或者先预览
npm run preview
```

#### 方式 B：使用 GitHub 自动部署

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "准备部署"
git push origin main
```

2. **在 Cloudflare Dashboard 创建 Pages 项目**
   - 访问：https://dash.cloudflare.com/
   - 进入 **Workers & Pages** → **Create application**
   - 选择 **Pages** → **Connect to Git**
   - 选择你的 GitHub 仓库

3. **配置构建设置**
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
Node version: 20
```

4. **添加环境变量**（见下方）

5. **保存并部署**

### 🔧 配置 wrangler.jsonc

已配置的 `wrangler.jsonc` 需要添加数据库绑定：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "cf-landing",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  },
  "observability": {
    "enabled": true
  },
  // 添加环境变量
  "vars": {
    "NODE_ENV": "production"
  }
  // 如果使用 Hyperdrive 连接 PostgreSQL
  // [[hyperdrive]]
  // binding = "DB"
  // id = "your-hyperdrive-id"
}
```

### 🗄️ PostgreSQL + Hyperdrive（推荐）

Cloudflare Hyperdrive 为 PostgreSQL 提供连接池和缓存：

```bash
# 1. 创建 Hyperdrive
wrangler hyperdrive create my-postgres \
  --connection-string="postgresql://user:password@host:5432/dbname"

# 2. 获取 Hyperdrive ID（会显示在输出中）

# 3. 在 wrangler.jsonc 中配置
[[hyperdrive]]
binding = "DB"
id = "your-hyperdrive-id"
```

### 🔐 配置 Secrets

```bash
# 添加数据库连接字符串
wrangler secret put DATABASE_URL

# 其他敏感信息
wrangler secret put MY_SECRET_KEY
```

### ✅ 验证部署

```bash
# 访问你的域名
https://your-project.pages.dev
```

---

## 2️⃣ Vercel 部署（最简单）

### ✅ 优势
- 🎯 专为 Next.js 优化
- 🚀 零配置部署
- 🔄 自动 CI/CD
- 📊 内置分析

### 🚀 部署步骤

#### 方式 A：使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 生产部署
vercel --prod
```

#### 方式 B：使用 Vercel Dashboard

1. **访问** https://vercel.com
2. **导入项目** → 选择 GitHub 仓库
3. **配置环境变量**（见下方）
4. **部署**

### 🗄️ 数据库推荐

- **Vercel Postgres**（推荐，深度集成）
- **Supabase**
- **Neon**
- **PlanetScale**

### ⚙️ vercel.json 配置（可选）

创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1", "sin1"],
  "env": {
    "DATABASE_URL": "@database-url"
  }
}
```

---

## 3️⃣ 传统服务器部署（Docker）

### ✅ 优势
- 🔧 完全可控
- 💾 自托管数据库
- 🌐 适合企业内网

### 📦 1. 创建 Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建 Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 运行应用
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/lib/generated/prisma ./lib/generated/prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 📦 2. 创建 docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/cf_landing
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=cf_landing
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### 📦 3. 创建 nginx.conf

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream nextjs {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # 重定向到 HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/certs/cert.pem;
        ssl_certificate_key /etc/nginx/certs/key.pem;

        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 🚀 4. 部署命令

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 重启
docker-compose restart
```

### 📦 5. 修改 next.config.mjs（Docker 需要）

```js
// next.config.mjs
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const nextConfig = {
  output: 'standalone', // 添加此行，用于 Docker 部署
}

export default nextConfig

// 仅在开发环境初始化 Cloudflare
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev()
}
```

---

## 🗄️ 数据库配置

### 选择数据库服务

| 服务 | 免费额度 | 特点 | 推荐场景 |
|------|---------|------|---------|
| **Supabase** | 500MB | 实时订阅、自动备份 | 全功能应用 |
| **Neon** | 0.5GB | Serverless、分支功能 | Vercel 项目 |
| **Railway** | $5/月 | 简单易用 | 快速原型 |
| **Render** | 免费 | 自动备份 | 小型项目 |
| **自托管** | 无限制 | 完全控制 | 企业项目 |

### 配置步骤

#### 1. Supabase（推荐）

```bash
# 1. 注册 https://supabase.com
# 2. 创建新项目
# 3. 获取连接字符串：Project Settings → Database → Connection string

DATABASE_URL="postgresql://postgres.[项目ID]:[密码]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

#### 2. Neon（Serverless）

```bash
# 1. 注册 https://neon.tech
# 2. 创建项目
# 3. 复制连接字符串

DATABASE_URL="postgresql://[用户名]:[密码]@[endpoint].neon.tech/[dbname]?sslmode=require"
```

### 初始化数据库

```bash
# 1. 推送数据库结构
npx prisma db push

# 或创建迁移
npx prisma migrate deploy

# 2. 可选：导入种子数据
npm run prisma:seed
```

---

## 🔐 环境变量配置

### 必需的环境变量

```bash
# 数据库
DATABASE_URL="postgresql://..."

# Node 环境
NODE_ENV="production"
```

### 可选的环境变量

```bash
# Analytics（如果使用 Vercel Analytics）
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="..."

# 自定义域名
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

### Cloudflare Pages 配置

在 Cloudflare Dashboard → Workers & Pages → 你的项目 → Settings → Environment variables

```
DATABASE_URL = postgresql://...
NODE_ENV = production
```

### Vercel 配置

在 Vercel Dashboard → 你的项目 → Settings → Environment Variables

```
DATABASE_URL = postgresql://...
```

---

## 🔄 CI/CD 自动部署

### GitHub Actions（适用于传统服务器）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/cf-landing
```

---

## ✅ 部署检查清单

### 部署前

- [ ] 数据库已创建并可访问
- [ ] 环境变量已配置
- [ ] `DATABASE_URL` 正确
- [ ] 运行 `npx prisma generate`
- [ ] 本地测试通过 `npm run build && npm run start`

### 部署后

- [ ] 网站可访问
- [ ] 数据库连接正常
- [ ] API 路由工作正常
- [ ] 静态资源加载正常
- [ ] Middleware 正常工作
- [ ] 配置页面（`?config=1`）可访问
- [ ] 日志页面（`/logs`）可访问

---

## 🐛 常见问题

### 问题 1：Prisma Client 未找到

```bash
Error: @prisma/client did not initialize yet
```

**解决方案：**
```bash
npx prisma generate
```

### 问题 2：数据库连接失败

```bash
Error: Can't reach database server
```

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确
2. 确认数据库服务正在运行
3. 检查防火墙/安全组设置
4. 确认 SSL 模式（生产环境需要 `?sslmode=require`）

### 问题 3：构建失败

```bash
Error: Build failed
```

**解决方案：**
```bash
# 清理缓存
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

### 问题 4：Cloudflare 部署超时

**解决方案：**
```bash
# 增加超时时间
wrangler pages deploy --timeout 600
```

---

## 📊 性能优化

### 1. 数据库连接池

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. 启用 Next.js 缓存

```typescript
// next.config.mjs
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
}
```

### 3. CDN 静态资源

将图片等静态资源上传到：
- Cloudflare R2
- AWS S3
- Vercel Blob Storage

---

## 📚 参考资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vercel 部署文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署文档](https://www.prisma.io/docs/guides/deployment)
- [Docker 官方文档](https://docs.docker.com/)

---

## 🆘 需要帮助？

如果遇到部署问题：

1. 检查控制台错误日志
2. 查看上述常见问题
3. 确认环境变量配置
4. 测试数据库连接

**推荐部署方案：**
- 🥇 **Cloudflare Pages** - 全球 CDN，边缘计算
- 🥈 **Vercel** - 零配置，专为 Next.js 优化
- 🥉 **Docker** - 完全可控，适合企业

选择最适合你需求的方案开始部署吧！🚀

