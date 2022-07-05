module.exports = {
  apps: [
    {
      name: 'mx-kami',
      script: '.next/standalone/server.js',
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
