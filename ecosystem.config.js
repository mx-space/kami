/*
 * @Author: Innei
 * @Date: 2020-04-26 11:53:46
 * @LastEditTime: 2021-01-22 10:50:49
 * @LastEditors: Innei
 * @FilePath: /web/ecosystem.config.js
 * @MIT
 */
const meta = require('./version')
module.exports = {
  apps: [
    {
      name: 'mx-web',
      script: 'yarn run next start -p 2323',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
      env: {
        NODE_ENV: 'production',
        VERSION: meta.version,
        HASH: meta.hash,
      },
    },
  ],
}
