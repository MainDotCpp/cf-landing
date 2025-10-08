// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const nextConfig = {
  /* config options here */
  // output: 'standalone', // 取消注释以启用 Docker 部署
}

export default nextConfig

// 仅在开发环境初始化 Cloudflare
if (process.env.NODE_ENV !== 'production') {
  initOpenNextCloudflareForDev()
}
