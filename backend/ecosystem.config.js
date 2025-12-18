module.exports = {
  apps : [{
    name   : "food-quality-backend",
    script : "./dist/server.js",
    instances : "max",
    exec_mode : "cluster",
    env_production: {
      NODE_ENV: "production",
      PORT: 5001
    },
    env_development: {
      NODE_ENV: "development",
      PORT: 5001
    }
  }]
}