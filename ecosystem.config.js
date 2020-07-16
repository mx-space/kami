/*
 * @Author: Innei
 * @Date: 2020-04-26 11:53:46
 * @LastEditTime: 2020-07-14 21:07:47
 * @LastEditors: Innei
 * @FilePath: /mx-web/ecosystem.config.js
 * @MIT
 */

module.exports = {
  apps: [
    {
      name: 'MxSpace',
      script: 'build/server/index.js',

      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
