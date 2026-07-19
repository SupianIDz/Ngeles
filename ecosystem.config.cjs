module.exports = {
  apps: [
    {
      name: "ngeles",
      script: "server/index.ts",
      interpreter: "bun",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0"
      }
    }
  ]
};
