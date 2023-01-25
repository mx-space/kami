process.title = 'Kami (NextJS)'

const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
const path = require('path')

const env = require('dotenv').config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const configs = {
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
    legacyBrowsers: false,
    newNextLinkBehavior: true,
  },
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // your aliases
      '@mx-space/kami-design': path.resolve(
        __dirname,
        './packages/kami-design',
      ),
    }

    config.plugins.push(new WindiCSSWebpackPlugin())

    return config
  },
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return {
      fallback: [
        { source: '/:page*/:slug*', destination: '/posts/:page*/:slug*' },
      ],
    }
  },
}

module.exports = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})(configs)
