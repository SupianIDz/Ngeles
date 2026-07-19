module.exports = {
  apps: [
    {
      name: "ngeles",
      script: "bun run server/index.ts",
      interpreter: "/bin/bash",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0"
      }
    }
  ]
};
