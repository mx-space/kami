module.exports = {
  ...require('@innei/prettier'),
  importOrder: [
    'windi.css',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@(.*)/(.*)$',
    '',
    '^~/(.*)$',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
}
