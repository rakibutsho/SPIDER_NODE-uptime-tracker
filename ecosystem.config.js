module.exports = {
  apps: [
    {
      name: "uptime-tracker",
      script: "npm",
      args: "run start",
      cwd: "/home/rakibul_islam/my-codes/uptime-tracker",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
