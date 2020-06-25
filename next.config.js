/*
 * @Author: Innei
 * @Date: 2020-04-18 16:00:58
 * @LastEditTime: 2020-06-25 15:17:51
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
    env: {
      PORT: 2323,
      ...env,
    },
    assetPrefix: isProd ? env.ASSETPREFIX || '' : '',
    experimental: {
      async rewrites() {
        return [
          { source: '/sitemap.xml', destination: '/api/sitemap' },
          { source: '/feed', destination: '/api/feed' },
          { source: '/rss', destination: '/api/feed' },
          { source: '/atom.xml', destination: '/api/feed' },
          {
            source: '/service-worker.js',
            destination: '/_next/static/service-worker.js',
          },
        ]
      },
      modern: true,
    },
  }),
)

module.exports = isProd
  ? withOffline({
      workboxOpts: {
        swDest: process.env.NEXT_EXPORT
          ? 'service-worker.js'
          : 'static/service-worker.js',
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
