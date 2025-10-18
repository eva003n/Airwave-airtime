export const apps = [
  //Process-1 : main http server that handles http request
  {
    name: "airwave-airtime-api",
    script: "./dist/index.js",
    watch: ".",
  },
  //Process-2 : Handles background jobs
  {
    name: "validation-worker",
    script: "./dist/workers/validate.worker.js",
    watch: ["./dist/workers"],
  },
  {
    name: "progress-worker",
    script: "./dist/workers/progress.worker.js",
    watch: ["./dist/workers/progress.worker.js"],
  },
];
export const deploy = {
  production: {
    user: 'SSH_USERNAME',
    host: 'SSH_HOSTMACHINE',
    ref: 'origin/master',
    repo: 'GIT_REPOSITORY',
    path: 'DESTINATION_PATH',
    'pre-deploy-local': '',
    'post-deploy': 'pnpm install && pm2 reload ecosystem.config.js --env production',
    'pre-setup': ''
  }
};
