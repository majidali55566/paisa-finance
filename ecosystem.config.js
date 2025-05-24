console.log(process.env.REDIS_URL);
module.exports = {
  apps: [
    // Next.js application
    // {
    //   name: "next-app",
    //   script: "npm",
    //   args: "run start",
    //   cwd: __dirname,
    //   watch: false, // Disable watch in production
    //   env_production: {
    //     NODE_ENV: "production",
    //     PORT: 3000,
    //   },
    // },

    // BullMQ worker
    {
      name: "bullmq-worker",
      // script: "tsx",
      // args: "./src/lib/worker.ts",
      script: "cmd.exe",
      args: "/c npx tsx ./src/lib/worker.ts",
      cwd: __dirname,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
        REDIS_URL:
          "redis://default:AS2fAAIjcDFlOTVmZTYzYTc5OWI0YjVhYjQwZTEyMWVmZDkwNzJlOHAxMA@ready-lamprey-11679.upstash.io:6379",
      },
      max_memory_restart: "500M",
    },
  ],

  deploy: {
    production: {
      user: "your-server-username",
      host: ["your-server-ip"],
      ref: "origin/main",
      repo: "git@github.com:yourusername/your-repo.git",
      path: "/var/www/your-app",
      "pre-deploy-local": "",
      "post-deploy": `
        npm install &&
        npm run build &&
        pm2 reload ecosystem.config.js --env production &&
        pm2 save
      `,
      "pre-setup": "",
      env: {
        NODE_ENV: "production",
        REDIS_URL: process.env.REDIS_URL,
      },
    },
  },
};
