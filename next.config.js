process.title = 'Kami (NextJS)'

const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
const withPlugins = require('next-compose-plugins')
const path = require('path')

const env = require('dotenv').config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

const plugins = []

if (process.env.ANALYZE === 'true') {
  plugins.push([require('@next/bundle-analyzer')({ enabled: true })])
}

/** @type {import('next').NextConfig} */
const configs = withPlugins(plugins, {
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,

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
})

module.exports = configs
