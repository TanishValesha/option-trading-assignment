const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "13.53.214.108",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "stockdb",
  user: process.env.DB_USER || "myuser",
  password: process.env.DB_PASSWORD || "Swapnil703369",
  ssl: {
    rejectUnauthorized: false, // required if AWS RDS enforces SSL
  },
});

module.exports = pool;