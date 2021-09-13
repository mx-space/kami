/*
 * @Author: Innei
 * @Date: 2020-04-18 16:00:58
 * @LastEditTime: 2021-06-27 16:20:22
 * @LastEditors: Innei
 * @FilePath: /web/next.config.js
 * @MIT
 */

const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const env = require('dotenv').config().parsed || {}

const withOffline = require('next-offline')
const configs = withBundleAnalyzer({
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
    }
    return config
  },
  env: {
    PORT: 2323,
    ...env,
  },
  assetPrefix: isProd ? env.ASSETPREFIX || '' : '',
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const base = [
      { source: '/sitemap.xml', destination: '/api/sitemap' },
      { source: '/feed', destination: '/api/feed' },
      { source: '/rss', destination: '/api/feed' },
      { source: '/atom.xml', destination: '/api/feed' },
      {
        source: '/service-worker.js',
        destination: '/_next/static/service-worker.js',
      },
      {
        source: '/api/:path*',
        destination: env.NEXT_PUBLIC_APIURL + '/:path*',
      },
    ]
    // this can remove after test
    if (isProd && env.ASSETPREFIX) {
      base.push({
        source: '/autostatic/:path*',
        destination: env.ASSETPREFIX + '/_next/static/:path*',
      })
    }
    return base
  },
  // 小水管就算了吧
  // __NEXT_OPTIMIZE_FONTS=true 暂时
  optimizeFonts: false,
  experimental: {
    granularChunks: true,
    modern: true,
    scrollRestoration: true,
  },
})

module.exports = isProd
  ? withOffline({
      workboxOpts: {
        swDest: process.env.NEXT_EXPORT
          ? 'service-worker.js'
          : 'static/service-worker.js',
        modifyURLPrefix: {
          // @see: https://github.com/hanford/next-offline/issues/263#issuecomment-738155607
          'autostatic/':
            (env.ASSETPREFIX ? env.ASSETPREFIX + '/' : '') + '_next/static/', // new addition
          'static/':
            (env.ASSETPREFIX ? env.ASSETPREFIX + '/' : '') + '_next/static/',
          'public/':
            (env.ASSETPREFIX ? env.ASSETPREFIX + '/' : '') + '_next/public/',
        },
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offlineCache',
              expiration: {
                maxEntries: 200,
              },
            },
          },
        ],
      },
      ...configs,
    })
  : configs
