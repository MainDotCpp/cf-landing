# ========================================
# Stage 1: 依赖安装
# ========================================
FROM node:20-slim AS deps

WORKDIR /app

# 安装 OpenSSL（Prisma 需要）
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm install --legacy-peer-deps

# ========================================
# Stage 2: 构建应用
# ========================================
FROM node:20-slim AS builder

WORKDIR /app

# 安装 OpenSSL
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制所有源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 禁用遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 构建 Next.js 应用
RUN npm run build

# ========================================
# Stage 3: 生产运行
# ========================================
FROM node:20-slim AS runner

WORKDIR /app

# 安装 OpenSSL（Prisma 运行时需要）
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 设置生产环境
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 Prisma 相关文件
COPY --from=builder /app/lib/generated/prisma ./lib/generated/prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]

