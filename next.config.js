const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withImages = require('next-images')
module.exports = withImages(
  withBundleAnalyzer({
    env: {
      // apiUrl: 'http://47.114.54.60:2333/',
      apiUrl: 'http://localhost:2333',
    },
    assetPrefix: isProd
      ? 'https://cdn.jsdelivr.net/gh/Innei/web-cdn@master'
      : '',
  }),
)
