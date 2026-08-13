const { GoogleGenAI, Type } = require("@google/genai");

/** Backend-owned allowlist — LLM may only choose from these. */
const ALLOWED_CATEGORIES = Object.freeze([
  "Technical",
  "Billing",
  "Account",
  "General",
]);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Validate that the model returned an allowed category.
 * Backend is the source of truth — never trust the LLM blindly.
 * @param {unknown} category
 * @returns {string} validated category
 */
function validateCategory(category) {
  if (typeof category !== "string") {
    throw new Error("Invalid AI category: category must be a string");
  }

  const normalized = category.trim();

  if (!ALLOWED_CATEGORIES.includes(normalized)) {
    throw new Error(
      `Invalid AI category: "${normalized}". Expected one of: ${ALLOWED_CATEGORIES.join(", ")}`
    );
  }

  return normalized;
}

/**
 * One Gemini call with structured JSON output:
 *   question → model analyzes meaning → picks ONE category + writes response
 *
 * responseSchema forces the model to emit only allowed category values.
 * Backend still re-validates before anything is saved.
 *
 * @param {string} question
 * @returns {Promise<{ response: string, category: string }>}
 */
async function generateSupportResponse(question) {
  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your_api_key" ||
    process.env.GEMINI_API_KEY === "your_gemini_api_key"
  ) {
    const err = new Error(
      "GEMINI_API_KEY is missing or invalid. Set it in backend/.env and restart the server."
    );
    err.status = 401;
    throw err;
  }

  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: question,
    config: {
      systemInstruction: `You are a customer support assistant.

Analyze the customer's question and:
1. Classify it into exactly ONE of these categories:
   - Technical — bugs, errors, product/API issues, outages
   - Billing — charges, invoices, refunds, payments, subscriptions
   - Account — login, password, 2FA, profile, access permissions
   - General — how-to questions or anything that does not fit above
2. Write a concise, professional support response.

Return structured JSON only (category + response).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            format: "enum",
            enum: [...ALLOWED_CATEGORIES],
            description:
              "Exactly one support category for the customer question.",
          },
          response: {
            type: Type.STRING,
            description:
              "Concise, professional customer-support reply to the question.",
          },
        },
        required: ["category", "response"],
      },
    },
  }).catch((err) => {
    const status = err?.status || err?.statusCode || err?.code || err?.error?.code;
    const message = err?.message || err?.error?.message || String(err);
    const normalized = new Error(message);
    normalized.status = status;
    normalized.code = status;
    throw normalized;
  });

  const raw = result.text;
  if (!raw) {
    throw new Error("Empty response from Gemini");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const response =
    typeof parsed.response === "string" ? parsed.response.trim() : "";

  if (!response) {
    throw new Error("AI response is missing");
  }

  // Backend control point: allowlist check before DB save
  const category = validateCategory(parsed.category);

  return { response, category };
}

module.exports = {
  generateSupportResponse,
  validateCategory,
  ALLOWED_CATEGORIES,
  VALID_CATEGORIES: ALLOWED_CATEGORIES,
};
