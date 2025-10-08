# 🐳 Docker 部署指南

## 前提条件

- 宿主机已安装 PostgreSQL 数据库
- 宿主机已安装 Nginx
- 已安装 Docker 和 Docker Compose

## 快速部署

### 1. 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker .env.docker.prod

# 编辑配置
nano .env.docker.prod
```

修改数据库连接（使用宿主机数据库）：
```bash
DATABASE_URL="postgresql://user:password@host.docker.internal:5432/dbname?schema=public"
```

### 2. 初始化数据库

在宿主机上执行：
```bash
# 创建数据库
createdb cf_landing

# 或使用 SQL
psql -U postgres
CREATE DATABASE cf_landing;

# 推送数据库结构
npx prisma db push
```

### 3. 部署应用

```bash
# 首次部署（构建镜像）
./deploy.sh --fresh

# 后续部署
./deploy.sh
```

### 4. 配置 Nginx 反向代理

在宿主机 Nginx 配置中添加：

```nginx
upstream docker_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://docker_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重启 Nginx：
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 常用命令

```bash
# 部署
./deploy.sh --build          # 重新构建并部署
./deploy.sh --fresh          # 全新部署

# 管理
docker compose up -d          # 启动
docker compose stop           # 停止
docker compose restart        # 重启
docker compose ps             # 状态
docker compose logs -f        # 日志

# 脚本
./scripts/logs.sh            # 查看日志
./scripts/update.sh          # 更新应用

# 容器
docker compose exec app sh   # 进入容器
```

## 目录结构

```
.
├── Dockerfile              # Docker 镜像配置
├── docker-compose.yml      # Docker Compose 配置
├── deploy.sh              # 部署脚本
├── .env.docker            # 环境变量模板
├── .env.docker.prod       # 生产环境变量（不提交到 Git）
└── scripts/
    ├── logs.sh            # 日志查看
    └── update.sh          # 应用更新
```

## 故障排除

### 应用无法连接数据库

检查 `DATABASE_URL` 配置：
```bash
# 确保使用 host.docker.internal
DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/dbname"
```

### 端口冲突

```bash
# 查看端口占用
sudo lsof -i :3000

# 或修改 docker-compose.yml 中的端口映射
ports:
  - "3001:3000"  # 使用其他端口
```

### 查看日志

```bash
# 查看应用日志
docker compose logs -f app

# 查看最近 50 行
docker compose logs --tail=50 app
```

## 数据库备份

在宿主机上执行：
```bash
# 备份
pg_dump -U postgres cf_landing > backup_$(date +%Y%m%d).sql

# 恢复
psql -U postgres cf_landing < backup_20240101.sql
```

## 更新流程

```bash
# 方式 1：使用脚本
./scripts/update.sh

# 方式 2：手动
git pull origin main
docker compose build
docker compose up -d
```

## 监控

```bash
# 容器资源使用
docker stats

# 磁盘使用
docker system df

# 清理未使用资源
docker system prune -f
```

