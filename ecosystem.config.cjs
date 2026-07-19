module.exports = {
  apps: [
    {
      name: "ngeles",
      script: "bun",
      args: "run server/index.ts",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0"
      }
    }
  ]
};
