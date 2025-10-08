#!/bin/bash

# ========================================
# VPS 快速部署脚本
# ========================================
# 前提：已安装 Node.js, PM2, PostgreSQL, Nginx
# 功能：拉取最新代码 → 构建 → 启动
# ========================================

set -e

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 开始部署...${NC}"
echo ""

# 配置
PROJECT_DIR="/root/projects/cf-landing"
APP_NAME="cf-landing"

# 进入项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  项目目录不存在: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# 1. 拉取最新代码
echo -e "${BLUE}📥 拉取最新代码...${NC}"
git fetch origin
git reset --hard origin/main

# 2. 清理并重新安装依赖（避免跨平台问题）
echo -e "${BLUE}📦 更新依赖...${NC}"
rm -rf node_modules
npm install --include=optional

# 3. 生成 Prisma Client
echo -e "${BLUE}🔧 生成 Prisma Client...${NC}"
npx prisma generate

# 4. 构建应用
echo -e "${BLUE}🔨 构建应用...${NC}"
npm run build

# 5. 重启应用
echo -e "${BLUE}♻️  重启应用...${NC}"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 restart "$APP_NAME"
else
    pm2 start npm --name "$APP_NAME" -- start
    pm2 save
fi

# 等待启动
sleep 3

# 6. 健康检查
echo -e "${BLUE}🔍 健康检查...${NC}"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
else
    echo -e "${YELLOW}⚠️  应用可能未正常启动，请检查日志${NC}"
    pm2 logs "$APP_NAME" --lines 20 --nostream
    exit 1
fi

# 显示状态
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 服务状态${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
pm2 status

echo ""
echo -e "${BLUE}📝 常用命令:${NC}"
echo "  pm2 logs $APP_NAME     # 查看日志"
echo "  pm2 restart $APP_NAME  # 重启应用"
echo "  pm2 stop $APP_NAME     # 停止应用"
echo "  pm2 monit              # 监控资源"
echo ""

