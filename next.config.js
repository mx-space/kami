const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const env = require('dotenv').config().parsed || {}
const withPWA = require('next-pwa')

const configs = withBundleAnalyzer({
  webpack: (config, options) => {
    // config.experiments = {
    //   topLevelAwait: true,
    //   layers: true,
    // }
    return config
  },
  env: {
    PORT: 2323,
    ...env,
  },
  assetPrefix: isProd ? env.ASSETPREFIX || '' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const base = [
      { source: '/sitemap.xml', destination: '/api/sitemap' },
      { source: '/feed', destination: '/api/feed' },
      { source: '/rss', destination: '/api/feed' },
      { source: '/atom.xml', destination: '/api/feed' },
    ]

    if (env.NEXT_PUBLIC_APIURL) {
      base.push({
        source: '/api/:path*',
        destination: env.NEXT_PUBLIC_APIURL + '/:path*',
      })
    }
    return base
  },
  // 小水管就算了吧
  // __NEXT_OPTIMIZE_FONTS=true 暂时
  optimizeFonts: false,
})

module.exports = withPWA({
  ...configs,
  pwa: {
    // FIXME: generate wrong asset path
    // @see: https://github.com/shadowwalker/next-pwa/issues/289
    dest: 'public',

    register: true,
    skipWaiting: true,
    disable: !isProd,
  },
})
