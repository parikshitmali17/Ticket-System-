const { Pool } = require("pg");
require("dotenv").config();

const { isDatabaseConfigured } = require("./env");

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  category VARCHAR(20) NOT NULL
    CHECK (category IN ('Technical', 'Billing', 'Account', 'General')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at
  ON support_tickets (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_category
  ON support_tickets (category);
`;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err.message);
});

async function connectDB() {
  if (!isDatabaseConfigured()) {
    throw new Error(
      "DATABASE_URL is missing or still uses a placeholder. Update backend/.env with your real PostgreSQL credentials (see .env.example)."
    );
  }

  await pool.query("SELECT 1");
  await pool.query(SCHEMA_SQL);
  console.log("PostgreSQL connected and support_tickets table is ready");
}

async function closeDB() {
  await pool.end();
}

module.exports = Object.assign(pool, {
  connectDB,
  closeDB,
});
