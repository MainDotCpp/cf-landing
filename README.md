# 🚀 CF Landing

基于 Next.js 15 的多页面落地页系统，支持动态配置、语言过滤、请求日志等功能。

## ✨ 主要功能

- 🎯 **动态页面渲染** - 数据库配置页面内容
- 🌍 **语言过滤** - 基于用户语言自动显示内容
- 📊 **请求日志** - 记录和可视化请求
- ⚙️ **在线配置** - 访问 `?config=1` 配置页面
- 📈 **Google Analytics** - GA 追踪集成
- 🗄️ **PostgreSQL** - Prisma ORM

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 配置数据库
cp .env.example .env
# 编辑 .env 设置 DATABASE_URL

# 初始化数据库
npx prisma generate
npx prisma db push

# 启动开发服务器
npm run dev
```

### VPS 生产部署

查看 [PM2 部署指南](./PM2.md)

```bash
# 在 VPS 上
cd /root/projects/cf-landing
./vps-deploy.sh
```

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页（动态渲染）
│   ├── [...slug]/         # 动态路由
│   ├── config/            # 配置页面
│   ├── logs/              # 日志页面
│   └── api/               # API 路由
├── components/            # React 组件
├── lib/                   # 工具函数
│   ├── prisma.ts         # 数据库客户端
│   ├── url-config.ts     # URL 配置逻辑
│   └── request-logger.ts # 请求日志
├── middleware.ts          # 语言过滤中间件
├── prisma/               # 数据库 Schema
└── public/               # 静态资源
```

## 🔧 核心功能

### 1. 动态页面配置

访问任意 URL + `?config=1` 进入配置页面：

```
http://localhost:3000/any-path?config=1
```

可配置：
- 内部渲染页面路径
- CTA 按钮链接
- Google Analytics 代码

### 2. 语言过滤

在 `middleware.ts` 配置语言规则：

```typescript
const LANGUAGE_CONFIG = {
  homePage: 'all',           // 首页允许所有语言
  otherPages: ['ja', 'en'],  // 其他页面仅日语和英语
}
```

### 3. 请求日志

访问 `/logs` 查看：
- 请求统计
- 语言分布
- 拦截情况

## 📜 常用命令

```bash
# 开发
npm run dev              # 开发服务器
npm run build            # 构建
npm run start            # 启动生产服务器

# Prisma
npx prisma generate      # 生成 Client
npx prisma db push       # 推送结构
npx prisma studio        # 数据库管理

# PM2（VPS）
pm2 status               # 查看状态
pm2 logs cf-landing      # 查看日志
pm2 restart cf-landing   # 重启
```

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Prisma
- **部署**: Cloudflare Pages / Vercel / Docker
- **UI**: Radix UI + Shadcn

## 📝 环境变量

```bash
# 数据库（必需）
DATABASE_URL="postgresql://..."

# Node 环境
NODE_ENV="production"
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
