# 📦 PM2 部署指南

## 🚀 快速开始

### 本地测试 PM2 配置

```bash
# 安装 PM2（如果未安装）
npm install -g pm2

# 构建应用
npm run build

# 使用 PM2 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs cf-landing

# 停止
pm2 stop cf-landing
```

---

## 🌐 VPS 部署

### 方式 1：使用部署脚本（推荐）

```bash
# 在 VPS 上
cd /root/projects/cf-landing
./vps-deploy.sh
```

### 方式 2：手动部署

```bash
# 1. 拉取代码
git pull origin main

# 2. 安装依赖
rm -rf node_modules
npm install --include=optional

# 3. 生成 Prisma Client
npx prisma generate

# 4. 构建
npm run build

# 5. 启动 PM2
pm2 start ecosystem.config.js
pm2 save

# 6. 设置开机自启
pm2 startup
# 复制输出的命令并执行
```

---

## 📊 PM2 常用命令

### 进程管理

```bash
# 启动
pm2 start ecosystem.config.js

# 停止
pm2 stop cf-landing

# 重启
pm2 restart cf-landing

# 重载（零停机）
pm2 reload cf-landing

# 删除
pm2 delete cf-landing

# 查看列表
pm2 list

# 查看详情
pm2 show cf-landing
```

### 日志管理

```bash
# 查看实时日志
pm2 logs cf-landing

# 查看最近 100 行
pm2 logs cf-landing --lines 100

# 清空日志
pm2 flush

# 查看错误日志
pm2 logs cf-landing --err

# 查看输出日志
pm2 logs cf-landing --out
```

### 监控

```bash
# 实时监控
pm2 monit

# 查看资源使用
pm2 status
```

### 保存和恢复

```bash
# 保存当前进程列表
pm2 save

# 开机自启动
pm2 startup
# 按提示执行输出的命令

# 取消开机自启
pm2 unstartup

# 恢复进程
pm2 resurrect
```

---

## ⚙️ 配置说明

**ecosystem.config.js** 配置选项：

```javascript
{
  name: 'cf-landing',           // 应用名称
  instances: 1,                 // 实例数量（1 或 'max'）
  exec_mode: 'cluster',         // 执行模式（cluster/fork）
  max_memory_restart: '1G',     // 内存限制
  autorestart: true,            // 自动重启
  watch: false,                 // 文件监听（生产环境关闭）
  env: {
    NODE_ENV: 'production',
    PORT: 3000,
  },
}
```

### 调整实例数量

```javascript
// 单实例（节省内存）
instances: 1,

// 多实例（利用多核 CPU）
instances: 2,

// 最大实例（使用所有 CPU 核心）
instances: 'max',
```

---

## 🔧 故障排除

### 应用无法启动

```bash
# 查看详细日志
pm2 logs cf-landing --lines 200

# 查看错误日志
tail -f logs/pm2-error.log

# 删除并重新启动
pm2 delete cf-landing
pm2 start ecosystem.config.js
```

### 内存占用过高

修改 `ecosystem.config.js`：

```javascript
max_memory_restart: '500M',  // 降低内存限制
```

### 查看进程详情

```bash
pm2 describe cf-landing
```

---

## 🔄 更新流程

### 零停机更新

```bash
# 拉取代码
git pull

# 安装依赖
npm install

# 构建
npm run build

# 重载（零停机）
pm2 reload ecosystem.config.js
```

### 普通更新

```bash
# 运行部署脚本
./vps-deploy.sh
```

---

## 📈 性能优化

### 1. 启用集群模式

```javascript
instances: 'max',      // 使用所有 CPU
exec_mode: 'cluster',  // 集群模式
```

### 2. 配置日志轮转

```bash
# 安装 pm2-logrotate
pm2 install pm2-logrotate

# 配置
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 3. 监控告警

```bash
# 安装 PM2 Plus（可选）
pm2 link [secret] [public]
```

---

## 🆚 PM2 vs Docker

| 特性 | PM2 | Docker |
|------|-----|--------|
| 部署难度 | ⭐ 简单 | ⭐⭐⭐ 中等 |
| 性能 | 原生，更快 | 有轻微损耗 |
| 资源占用 | 更低 | 更高 |
| 隔离性 | 低 | 高 |
| 适用场景 | 单机部署 | 容器化部署 |

---

## 💡 最佳实践

1. **使用 ecosystem.config.js** - 统一管理配置
2. **启用集群模式** - 充分利用多核 CPU
3. **配置日志轮转** - 避免日志文件过大
4. **设置内存限制** - 防止内存泄漏
5. **定期备份数据** - 使用脚本定期备份数据库
6. **监控资源使用** - 定期检查 `pm2 monit`

---

## 🔐 安全建议

1. **不要用 root 运行**（如果可能）
2. **限制文件权限**
3. **定期更新依赖**
4. **配置防火墙**
5. **启用 HTTPS**

---

## 📚 参考资源

- [PM2 官方文档](https://pm2.keymetrics.io/)
- [PM2 集群模式](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [PM2 日志管理](https://pm2.keymetrics.io/docs/usage/log-management/)
