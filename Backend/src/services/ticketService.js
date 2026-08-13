const pool = require("../config/db");

/**
 * Persist a ticket after AI category has been validated.
 * Uses parameterized queries to prevent SQL injection.
 */
async function insertTicket({
  customerName,
  email,
  question,
  aiResponse,
  category,
}) {
  const result = await pool.query(
    `INSERT INTO support_tickets
      (customer_name, email, question, ai_response, category)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       id,
       customer_name,
       email,
       question,
       ai_response,
       category,
       created_at`,
    [customerName, email, question, aiResponse, category]
  );

  return mapTicketRow(result.rows[0]);
}

async function findAllTickets() {
  const result = await pool.query(
    `SELECT
       id,
       customer_name,
       email,
       question,
       ai_response,
       category,
       created_at
     FROM support_tickets
     ORDER BY created_at DESC`
  );

  return result.rows.map(mapTicketRow);
}

function mapTicketRow(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    question: row.question,
    aiResponse: row.ai_response,
    category: row.category,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
  };
}

module.exports = {
  insertTicket,
  findAllTickets,
};
