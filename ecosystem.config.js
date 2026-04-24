module.exports = {
  apps: [
    {
      name: 'paddy-backend',
      script: 'npm',
      args: 'run start:dev',
      cwd: '/root/paddy/backend',
      env: {
        NODE_ENV: 'development',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'paddy-frontend',
      script: 'npm',
      args: 'run start',
      cwd: '/root/paddy/frontend',
      env: {
        NODE_ENV: 'production',
        NVM_DIR: '/root/.nvm',
        PATH: '/root/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};