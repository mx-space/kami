import { config } from 'dotenv'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'

import NextBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'
import { sentryWebpackPlugin } from '@sentry/webpack-plugin'

// import { sentryWebpackPlugin } from '@sentry/webpack-plugin'

process.title = 'Kami (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-mutable-exports
let configs = {
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config, options) => {
    config.plugins.push(new WindiCSSWebpackPlugin())

    if (
      process.env.SENTRY === 'true' &&
      process.env.NEXT_PUBLIC_SENTRY_DSN &&
      isProd
    ) {
      config.plugins.push(
        sentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules', 'cypress', 'test'],
          urlPrefix: '~/_next',

          org: 'inneis-site',
          headers: {
            Authorization: `DSN ${process.env.NEXT_PUBLIC_SENTRY_DSN}`,
          },
          project: 'kami',
        }),
      )
    }

    return config
  },
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
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

if (process.env.SENTRY === 'true' && isProd) {
  configs = withSentryConfig(
    configs,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,

      org: 'inneis-site',
      project: 'kami',
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: '/monitoring',

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    },
  )
}

export default configs
