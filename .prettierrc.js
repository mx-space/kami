module.exports = {
  ...require('@innei/prettier'),
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@(.*)/(.*)$',
    '^~/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
}
