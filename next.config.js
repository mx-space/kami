/*
 * @Author: Innei
 * @Date: 2020-04-18 16:00:58
 * @LastEditTime: 2020-07-29 16:43:59
 * @LastEditors: Innei
 * @FilePath: /mx-web/next.config.js
 * @MIT
 */

const withSourceMaps = require('@zeit/next-source-maps')()

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
} = process.env

process.env.SENTRY_DSN = SENTRY_DSN

const isProd = process.env.NODE_ENV === 'production'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const env = require('dotenv').config().parsed || {}
const withImages = require('next-images')
const withOffline = require('next-offline')
const configs = withSourceMaps(
  withImages(
    withBundleAnalyzer({
      webpack: (config, options) => {
        // In `pages/_app.js`, Sentry is imported from @sentry/node. While
        // @sentry/browser will run in a Node.js environment, @sentry/node will use
        // Node.js-only APIs to catch even more unhandled exceptions.
        //
        // This works well when Next.js is SSRing your page on a server with
        // Node.js, but it is not what we want when your client-side bundle is being
        // executed by a browser.
        //
        // Luckily, Next.js will call this webpack function twice, once for the
        // server and once for the client. Read more:
        // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
        //
        // So ask Webpack to replace @sentry/node imports with @sentry/browser when
        // building the browser's bundle
        if (!options.isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

        // When all the Sentry configuration env variables are available/configured
        // The Sentry webpack plugin gets pushed to the webpack plugins to build
        // and upload the source maps to sentry.
        // This is an alternative to manually uploading the source maps
        // Note: This is disabled in development mode.
        if (
          SENTRY_DSN &&
          SENTRY_ORG &&
          SENTRY_PROJECT &&
          SENTRY_AUTH_TOKEN &&
          NODE_ENV === 'production'
        ) {
          config.plugins.push(
            new SentryWebpackPlugin({
              include: '.next',
              ignore: ['node_modules'],
              urlPrefix: '~/_next',
              release: options.buildId,
            }),
          )
        }

        return config
      },
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
        granularChunks: true,
        modern: true,
      },
    }),
  ),
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
