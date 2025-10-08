#!/bin/bash

# ========================================
# Docker Compose 简化部署脚本
# ========================================
# 使用方法: ./deploy.sh [选项]
# 选项:
#   --build    : 重新构建镜像
#   --fresh    : 全新部署（删除容器）
# ========================================

set -e

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# 配置
ENV_FILE=".env.docker.prod"

# 检查环境文件
if [ ! -f "$ENV_FILE" ]; then
    print_error "环境文件 $ENV_FILE 不存在"
    echo "创建方法: cp .env.docker $ENV_FILE && nano $ENV_FILE"
    exit 1
fi

# 解析参数
BUILD=false
FRESH=false

for arg in "$@"; do
    case $arg in
        --build) BUILD=true ;;
        --fresh) FRESH=true ;;
        --help)
            echo "使用方法: ./deploy.sh [选项]"
            echo "  --build : 重新构建镜像"
            echo "  --fresh : 全新部署"
            exit 0 ;;
        *)
            print_error "未知参数: $arg"
            exit 1 ;;
    esac
done

echo ""
print_info "🚀 开始部署..."
echo ""

# 全新部署
if [ "$FRESH" = true ]; then
    print_info "停止并删除容器..."
    docker compose down
fi

# 构建镜像
if [ "$BUILD" = true ] || [ "$FRESH" = true ]; then
    print_info "构建镜像..."
    docker compose build --no-cache
fi

# 启动服务
print_info "启动服务..."
docker compose --env-file "$ENV_FILE" up -d

# 等待启动
sleep 5

# 健康检查
print_info "健康检查..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "应用运行正常"
else
    print_error "应用启动失败，查看日志: docker compose logs"
    exit 1
fi

# 显示状态
echo ""
docker compose ps
echo ""
print_success "🎉 部署完成！"
echo ""
print_info "访问: http://localhost:3000"
print_info "日志: docker compose logs -f"
echo ""

