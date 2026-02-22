import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'global.divhunt.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
    ],
    // Max display width is 875px — drop unused larger breakpoints to reduce Vercel transformations
    deviceSizes: [640, 750, 875],
    imageSizes: [64, 120, 256, 384],
    // Cache optimized images for 30 days (only applies to fallback non-Payload images)
    minimumCacheTTL: 2592000,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
