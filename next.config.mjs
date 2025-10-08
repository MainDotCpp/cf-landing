// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const nextConfig = {
  /* config options here */
  output: 'standalone', // Docker 部署必需
  eslint: {
    ignoreDuringBuilds: true, // 构建时忽略 ESLint 错误
  },
  typescript: {
    ignoreBuildErrors: false, // 保留 TypeScript 类型检查
  },
}

export default nextConfig

// 仅在本地开发环境初始化 Cloudflare（VPS 上禁用）
if (process.env.NODE_ENV !== 'production' && !process.env.IS_VPS) {
  initOpenNextCloudflareForDev()
}
