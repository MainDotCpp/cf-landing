// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const nextConfig = {
  /* config options here */
  output: 'standalone', // Docker 部署必需
}

export default nextConfig

// 仅在开发环境初始化 Cloudflare
if (process.env.NODE_ENV !== 'production') {
  initOpenNextCloudflareForDev()
}
