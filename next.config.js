/*
 * @Author: Innei
 * @Date: 2020-04-18 16:00:58
 * @LastEditTime: 2020-08-04 15:43:05
 * @LastEditors: Innei
 * @FilePath: /mx-web/next.config.js
 * @MIT
 */

const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const env = require('dotenv').config().parsed || {}
const withImages = require('next-images')
const withOffline = require('next-offline')
const configs = withImages(
  withBundleAnalyzer({
    webpack: (config, options) => {
      return config
    },
    env: {
      PORT: 2323,
      ...env,
    },
    assetPrefix: isProd ? env.ASSETPREFIX || '' : '',
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
    experimental: {
      granularChunks: true,
      modern: true,
      scrollRestoration: true,
    },
    future: {
      webpack5: true,
    },
  }),
)

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
