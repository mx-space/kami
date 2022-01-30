module.exports = {
  apps: [
    {
      name: 'mx-kami',
      script: 'node .next/standalone/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
      env: {
        PORT: 2323,
        NODE_ENV: 'production',
        ...require('dotenv').config().parsed,
      },
    },
  ],
}
