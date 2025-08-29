const pool = require("./lib/dbConnection");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to AWS PostgreSQL!");
    console.log("Server time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  } finally {
    pool.end();
  }
}

testConnection();