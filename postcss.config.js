/*
 * @Author: Innei
 * @Date: 2020-09-02 17:01:31
 * @LastEditTime: 2020-09-02 17:01:34
 * @LastEditors: Innei
 * @FilePath: /troph-index/postcss.config.js
 * @Coding with Love
 */
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-flexbugs-fixes': {},
    'postcss-nested': { bubble: ['screen'], unwrap: ['layer'] },
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
        'nesting-rules': false,
        'color-mod-function': true,
        'system-ui-font-family': true,
        'hexadecimal-alpha-notation': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    },
  },
}
