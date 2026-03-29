// db.js
// This file connects our app to the PostgreSQL database.
// We use the "pg" library (PostgreSQL client for Node.js).

const { Pool } = require("pg");
require("dotenv").config();

// A "Pool" manages multiple database connections automatically.
// We use environment variables (from .env) so we never hardcode passwords.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the connection when the app starts
pool.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database!");
  }
});

// Export the pool so other files can use it to run queries
module.exports = pool;
