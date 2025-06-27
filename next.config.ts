import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { getAppUrl } from './utils/get-app-url'

const withNextIntl = createNextIntlPlugin()
const publicAppURL = getAppUrl()

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: { reactCompiler: true },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: publicAppURL.toString(),
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
