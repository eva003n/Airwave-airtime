export const apps = [
  {
    name: "topup-worker",
    // script: "./workers/topup.worker.js", //docker
    script: "dist/workers/topup.worker.js",
    instances: 2, //control concurrency
    autorestart: true,
    kill_timeout: 3000,
    env: {
      NODE_ENV: "production",
    },
    env_production: {
      NODE_ENV: "production",
    },
  },

  // Production web service
  {
    name: "airwave-airtime-api",
    // script: "./workers/topup.worker.js", //docker
    script: "dist/index.js",
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    wait_ready: true,
    kill_timeout: 3000,
       env: {
      NODE_ENV: "production",
    },
    env_production: {
      NODE_ENV: "production",
    },
  },
];
export const deploy = {
  production: {
    user: "SSH_USERNAME",
    host: "SSH_HOSTMACHINE",
    ref: "origin/master",
    repo: "GIT_REPOSITORY",
    path: "DESTINATION_PATH",
    "pre-deploy-local": "",
    "post-deploy":
      "pnpm install && pm2 reload ecosystem.config.js --env production",
    "pre-setup": "",
  },
};
