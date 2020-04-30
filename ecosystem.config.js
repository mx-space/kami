module.exports = {
  apps: [
    {
      name: 'MxSpace',
      script: 'build/server/index.js',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
