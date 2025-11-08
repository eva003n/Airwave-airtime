export const apps = [
  // Process 1: Main HTTP API
  {
    name: "airwave-airtime-sandbox-api",
    // script: "./index.js", //docker
    script: "dist/index.js", //local
    instances: 1,
    autorestart: true,
    // watch: ["."],
    env: {
      NODE_ENV: "development",
      PORT: 8000,
      PM2_NO_PIDUSAGE: "true", // ✅ disables wmic
    },
  },

  // Process 2: Worker for topups
  {
    name: "topups-worker",
    // script: "./workers/topup.worker.js", //docker
    script: "dist/workers/topup.worker.js", //docker
    instances: 1,
    autorestart: true,
    env: {
      // NODE_ENV: "development",
      PORT: 8100,
      PM2_NO_PIDUSAGE: "true", // ✅ disables wmic
    },
  },

  // Production service
  // {
  //   name: "airwave-airtime-api",
  //   // script: "./workers/topup.worker.js", //docker
  //   script: "dist/index.js",
  //   instances: 1,
  //   autorestart: true,
  //   env: {
  //     NODE_ENV: "production",
  //     PORT: 8080,
  //     PM2_NO_PIDUSAGE: "true", // ✅ disables wmic
  //   },
  // },
];
export const deploy = {
  production: {
    user: "SSH_USERNAME",
    host: "SSH_HOSTMACHINE",
    ref: "origin/master",
    repo: "GIT_REPOSITORY",
    path: "DESTINATION_PATH",
    "pre-deploy-local": "",
    "post-deploy": "pnpm install && pm2 reload ecosystem.config.js --env production",
    "pre-setup": "",
  },
};
