module.exports = {
  apps: [
    {
      name: "uptime-tracker",
      script: "npm",
      args: "run start",
      cwd: "/var/www/uptime-tracker",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
