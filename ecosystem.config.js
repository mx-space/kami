module.exports = {
  apps: [
    {
      name: 'mx-kami',
      script: 'yarn run next start -p 2323',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
    },
  ],
}
