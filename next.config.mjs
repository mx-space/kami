import { config } from 'dotenv'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'

import NextBundleAnalyzer from '@next/bundle-analyzer'

// import { sentryWebpackPlugin } from '@sentry/webpack-plugin'

process.title = 'Kami (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
let configs = {
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config, options) => {
    config.plugins.push(new WindiCSSWebpackPlugin())

    

    return config
  },
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/feed', destination: '/api/feed' },
        { source: '/atom.xml', destination: '/api/feed' },
        { source: '/sitemap', destination: '/api/sitemap' },
        { source: '/sitemap.xml', destination: '/api/sitemap' },
      ],
      fallback: [
        { source: '/:page*/:slug*', destination: '/posts/:page*/:slug*' },
      ],
    }
  },
}

if (process.env.ANALYZE === 'true') {
  configs = NextBundleAnalyzer({
    enabled: true,
  })(configs)
}

 

export default configs
