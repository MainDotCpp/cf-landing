const nextConfig = {
  output: 'standalone', // PM2 部署必需
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
