/*
 * @Author: Innei
 * @Date: 2020-04-26 11:53:46
 * @LastEditTime: 2020-05-22 14:39:00
 * @LastEditors: Innei
 * @FilePath: /mx-web/ecosystem.config.js
 * @MIT
 */

module.exports = {
  apps: [
    {
      name: 'MxSpace',
      script: 'build/server/index.js',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
