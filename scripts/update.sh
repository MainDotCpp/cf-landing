#!/bin/bash

# ========================================
# 应用更新脚本
# ========================================

set -e

echo "🔄 更新应用..."

# 拉取最新代码
echo "📥 拉取代码..."
git pull origin main

# 重新构建并启动
echo "🔨 构建镜像..."
docker compose build

echo "♻️  重启服务..."
docker compose up -d

# 等待并检查
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 更新成功！"
    docker compose ps
else
    echo "❌ 更新失败"
    docker compose logs --tail=20 app
    exit 1
fi

