/*
 * @Author: Innei
 * @Date: 2020-04-18 16:00:58
 * @LastEditTime: 2020-05-22 11:31:35
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
const withPWA = require('next-pwa')
module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
  ...withImages(
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
  ),
})
