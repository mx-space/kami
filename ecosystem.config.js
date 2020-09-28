/*
 * @Author: Innei
 * @Date: 2020-04-26 11:53:46
 * @LastEditTime: 2020-09-28 21:34:38
 * @LastEditors: Innei
 * @FilePath: /web/ecosystem.config.js
 * @MIT
 */
const meta = require('./version')
module.exports = {
  apps: [
    {
      name: 'MxSpace',
      script: 'npm run next start',

      instances: 'max',
      exec_mode: 'cluster',
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
