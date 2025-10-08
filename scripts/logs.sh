#!/bin/bash

# ========================================
# 日志查看脚本
# ========================================

SERVICE=${1:-app}
LINES=${2:-100}

echo "📋 显示日志 (最后 $LINES 行)..."
docker compose logs -f --tail="$LINES" "$SERVICE"

