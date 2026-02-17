import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const defaultCmsOrigin = 'https://ls-lacrosse-payload.jasonorlando14.workers.dev'
const configuredCmsOrigin =
  process.env.NEXT_PUBLIC_CMS_ORIGIN || process.env.CMS_ORIGIN || defaultCmsOrigin

const cmsUrl = (() => {
  try {
    return new URL(configuredCmsOrigin)
  } catch {
    return new URL(defaultCmsOrigin)
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        protocol: cmsUrl.protocol === 'http:' ? 'http' : 'https',
        hostname: cmsUrl.hostname,
      },
      {
        protocol: 'https',
        hostname: 'global.divhunt.com',
      },
    ],
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
