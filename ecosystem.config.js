module.exports = {
  apps: [
    {
      name: 'cf-landing',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 'max', // 或 'max' 使用所有 CPU 核心
      exec_mode: 'cluster', // 使用集群模式
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],
}
