const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const env = require('dotenv').config().parsed || {}
const withImages = require('next-images')
module.exports = withImages(
  withBundleAnalyzer({
    env: {
      PORT: 2323,
      ...env,
    },
    assetPrefix: isProd ? env.ASSETPREFIX || '' : '',
    experimental: {
      async rewrites() {
        return [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
      },
    },
  }),
)
