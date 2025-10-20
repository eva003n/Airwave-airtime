export const apps = [
  // Process 1: Main HTTP API
  {
    name: "airwave-airtime-api",
    script: "./dist/index.js",
    watch: ["./src"],
    env: {
      NODE_ENV: "development",
      PM2_NO_PIDUSAGE: "true", // ✅ disables wmic
    },
  },

  // Process 2: Worker for topups
  {
    name: "topups-worker",
    script: "./dist/workers/topup.worker.js",
    watch: ["./src/workers"],
    env: {
      NODE_ENV: "development",
      PM2_NO_PIDUSAGE: "true", // ✅ disables wmic
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
    "post-deploy": "pnpm install && pm2 reload ecosystem.config.js --env production",
    "pre-setup": "",
  },
};
