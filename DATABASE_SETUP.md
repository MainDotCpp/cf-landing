# 📦 数据库配置指南 - PostgreSQL

## 当前配置

已将数据库从 SQLite 切换到 **PostgreSQL**。

## 🚀 快速配置

### 1. 配置环境变量

在项目根目录创建或编辑 `.env` 文件：

```bash
# .env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### 2. PostgreSQL 连接字符串格式

```
postgresql://[用户名]:[密码]@[主机]:[端口]/[数据库名]?schema=public
```

**示例：**

#### 本地开发
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/cf_landing?schema=public"
```

#### Cloudflare D1 (需要 Hyperdrive)
```bash
DATABASE_URL="postgresql://[用户名]:[密码]@[hyperdrive-endpoint].workers.dev:5432/[database]?schema=public"
```

#### Supabase
```bash
DATABASE_URL="postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres?schema=public"
```

#### Neon
```bash
DATABASE_URL="postgresql://[用户名]:[密码]@[endpoint].neon.tech/[dbname]?sslmode=require"
```

#### Railway
```bash
DATABASE_URL="postgresql://postgres:[密码]@[host].railway.app:5432/railway?schema=public"
```

#### Render
```bash
DATABASE_URL="postgresql://[用户名]:[密码]@[host].render.com:5432/[dbname]?schema=public"
```

## 📋 迁移步骤

### 方式 1：全新数据库（推荐）

如果是全新的 PostgreSQL 数据库：

```bash
# 1. 生成 Prisma Client
npx prisma generate

# 2. 推送数据库结构（开发环境）
npx prisma db push

# 或者创建迁移（生产环境推荐）
npx prisma migrate dev --name init
```

### 方式 2：从 SQLite 迁移数据

如果需要保留现有 SQLite 数据：

```bash
# 1. 导出 SQLite 数据
npm install -g prisma-db-export
prisma-db-export --output ./backup.json

# 2. 配置 PostgreSQL 连接
# 编辑 .env 文件

# 3. 创建表结构
npx prisma db push

# 4. 导入数据
npx prisma db seed  # 需要配置 seed 脚本
```

## 🔧 验证连接

测试数据库连接是否成功：

```bash
npx prisma db pull
```

如果成功，会显示当前数据库结构。

## 📊 数据库管理工具

### Prisma Studio（推荐）
```bash
npx prisma studio
```

在浏览器中打开 `http://localhost:5555` 管理数据库。

### pgAdmin
下载安装：https://www.pgadmin.org/

### TablePlus
下载安装：https://tableplus.com/

## 🌐 推荐的 PostgreSQL 服务

### 1. Supabase（免费额度慷慨）
- ✅ 免费 500MB 存储
- ✅ 实时订阅
- ✅ 自动备份
- 🔗 https://supabase.com

### 2. Neon（Serverless PostgreSQL）
- ✅ 免费 0.5GB 存储
- ✅ 自动扩展
- ✅ 分支功能
- 🔗 https://neon.tech

### 3. Railway
- ✅ 免费 $5 额度/月
- ✅ 简单易用
- ✅ 自动部署
- 🔗 https://railway.app

### 4. Render
- ✅ 免费 PostgreSQL 实例
- ✅ 自动备份
- 🔗 https://render.com

### 5. Vercel Postgres
- ✅ 与 Vercel 深度集成
- ✅ 边缘缓存
- 🔗 https://vercel.com/storage/postgres

## 🔐 安全建议

### 1. 使用环境变量
```bash
# ✅ 正确
DATABASE_URL="postgresql://..."

# ❌ 错误 - 不要硬编码在代码中
const db = connect("postgresql://postgres:password@localhost")
```

### 2. 不要提交 .env 文件
确保 `.gitignore` 包含：
```
.env
.env.local
.env.*.local
```

### 3. 使用强密码
- 至少 16 位
- 包含大小写字母、数字、特殊字符

### 4. 启用 SSL
生产环境连接字符串添加：
```
?sslmode=require
```

## 🚨 常见问题

### 问题 1：连接被拒绝

**错误：**
```
Error: Can't reach database server at `localhost:5432`
```

**解决方案：**
1. 确保 PostgreSQL 服务正在运行
2. 检查防火墙设置
3. 确认端口号正确（默认 5432）

### 问题 2：认证失败

**错误：**
```
Error: Authentication failed for user
```

**解决方案：**
1. 检查用户名和密码
2. 确认用户有访问权限
3. 检查主机地址是否正确

### 问题 3：数据库不存在

**错误：**
```
Error: Database does not exist
```

**解决方案：**
```bash
# 先创建数据库
createdb cf_landing

# 或使用 SQL
psql -U postgres
CREATE DATABASE cf_landing;
```

### 问题 4：迁移失败

**错误：**
```
Error: Migration failed
```

**解决方案：**
```bash
# 重置数据库（⚠️ 会删除所有数据）
npx prisma migrate reset

# 或手动删除迁移记录
npx prisma migrate resolve --rolled-back [migration_name]
```

## 📝 Cloudflare Workers 部署

如果要部署到 Cloudflare Workers：

### 1. 使用 Hyperdrive
```bash
# 创建 Hyperdrive 配置
wrangler hyperdrive create my-hyperdrive \
  --connection-string="postgresql://..."

# 在 wrangler.toml 中配置
[[hyperdrive]]
binding = "DB"
id = "your-hyperdrive-id"
```

### 2. 配置环境变量
```toml
# wrangler.toml
[vars]
DATABASE_URL = "postgresql://..."
```

## 🎯 下一步

1. ✅ 已修改 `prisma/schema.prisma` 为 PostgreSQL
2. ⏳ 配置 `.env` 文件中的 `DATABASE_URL`
3. ⏳ 运行 `npx prisma generate`
4. ⏳ 运行 `npx prisma db push` 或 `npx prisma migrate dev`
5. ⏳ 启动应用并测试

## 📚 参考资源

- [Prisma PostgreSQL 文档](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/)

---

**需要帮助？** 检查控制台输出的错误信息，通常会提供详细的错误描述。

