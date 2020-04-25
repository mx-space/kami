const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  env: {
    // apiUrl: 'http://47.114.54.60:2333/',
    apiUrl: 'http://localhost:2333',
  },
})
