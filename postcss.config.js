module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': { bubble: ['screen'], unwrap: ['layer'] },
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
        'nesting-rules': false,
      },
    },
  },
}
