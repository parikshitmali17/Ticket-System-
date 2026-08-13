const { generateSupportResponse } = require("../services/aiService");
const { insertTicket, findAllTickets } = require("../services/ticketService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const QUOTA_MESSAGE =
  "AI service free quota has been exceeded. Please ask owner to change API key.";

function isDatabaseError(err) {
  return (
    err.code === "ECONNREFUSED" ||
    err.code === "ENOTFOUND" ||
    err.code === "28P01" ||
    err.code === "3D000" ||
    err.code === "42P01" ||
    err.code === "57P03"
  );
}

function getErrorStatus(err) {
  return (
    err.status ||
    err.statusCode ||
    err.code ||
    err.error?.code ||
    err.response?.status ||
    null
  );
}

function isQuotaExceededError(err) {
  const status = getErrorStatus(err);
  if (status === 429 || status === "429") return true;

  const text = [
    err.message,
    err.statusText,
    err.error?.message,
    err.error?.status,
    typeof err === "string" ? err : "",
  ]
    .filter(Boolean)
    .join(" ");

  return /quota|rate.?limit|RESOURCE_EXHAUSTED|Too Many Requests|exceeded your current quota/i.test(
    text
  );
}

/**
 * POST /api/tickets
 *
 * Customer Question
 *        ↓
 *    Gemini (structured output)
 *        ↓
 * Analyze meaning → choose ONE category + response
 *        ↓
 * Backend validates category against allowlist
 *        ↓
 * PostgreSQL (support_tickets)
 */
async function createTicket(req, res) {
  try {
    const customerName =
      typeof req.body.customerName === "string"
        ? req.body.customerName.trim()
        : "";
    const email =
      typeof req.body.email === "string" ? req.body.email.trim() : "";
    const question =
      typeof req.body.question === "string" ? req.body.question.trim() : "";

    if (!customerName || !email || !question) {
      return res.status(400).json({
        success: false,
        message: "Customer name, email and question are required.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const { response: aiResponse, category } =
      await generateSupportResponse(question);

    const ticket = await insertTicket({
      customerName,
      email,
      question,
      aiResponse,
      category,
    });

    return res.status(201).json(ticket);
  } catch (err) {
    console.error("createTicket error:", err.message || err);

    // Never expose raw Google/Gemini error payloads to the client.
    if (isQuotaExceededError(err)) {
      return res.status(429).json({
        success: false,
        message: QUOTA_MESSAGE,
      });
    }

    if (
      err.status === 401 ||
      err.status === 403 ||
      /API[_ ]?KEY|api key|PERMISSION_DENIED|UNAUTHENTICATED|invalid.?api.?key/i.test(
        err.message || ""
      )
    ) {
      return res.status(502).json({
        success: false,
        message:
          "Gemini API key is missing or invalid. Set GEMINI_API_KEY in backend/.env and restart the server.",
      });
    }

    if (
      (err.message || "").startsWith("Invalid AI category") ||
      err.message === "AI returned invalid JSON" ||
      err.message === "AI response is missing" ||
      err.message === "Empty response from Gemini"
    ) {
      return res.status(502).json({
        success: false,
        message: "Unable to generate a valid AI response. Please try again.",
      });
    }

    if (isDatabaseError(err)) {
      return res.status(503).json({
        success: false,
        message:
          "Database is unavailable. Check PostgreSQL is running, DATABASE_URL in .env, and that support_ticket_db exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create ticket. Please try again.",
    });
  }
}

/**
 * GET /api/tickets
 */
async function getTickets(_req, res) {
  try {
    const tickets = await findAllTickets();
    return res.status(200).json(tickets);
  } catch (err) {
    console.error("getTickets error:", err.message);

    if (isDatabaseError(err)) {
      return res.status(503).json({
        success: false,
        message:
          "Database is unavailable. Check PostgreSQL and DATABASE_URL.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to load tickets. Please try again.",
    });
  }
}

module.exports = {
  createTicket,
  getTickets,
  isQuotaExceededError,
  QUOTA_MESSAGE,
};
