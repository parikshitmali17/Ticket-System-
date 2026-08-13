-- Create the database once (in psql or pgAdmin), then run this file against it:
--   CREATE DATABASE support_ticket_db;

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
