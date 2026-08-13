jest.mock("../../src/services/aiService", () => ({
  generateSupportResponse: jest.fn(),
}));

jest.mock("../../src/services/ticketService", () => ({
  insertTicket: jest.fn(),
  findAllTickets: jest.fn(),
}));

const { generateSupportResponse } = require("../../src/services/aiService");
const { insertTicket, findAllTickets } = require("../../src/services/ticketService");
const {
  createTicket,
  getTickets,
} = require("../../src/controllers/ticketController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("createTicket AI response handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validBody = {
    customerName: "Jane Doe",
    email: "jane@example.com",
    question: "I cannot log into my account.",
  };

  it("returns 400 when required fields are missing before calling AI", async () => {
    const res = mockRes();

    await createTicket({ body: { email: "jane@example.com" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Customer name, email and question are required.",
    });
    expect(generateSupportResponse).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email before calling AI", async () => {
    const res = mockRes();

    await createTicket(
      {
        body: {
          ...validBody,
          email: "not-an-email",
        },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Please provide a valid email address.",
    });
    expect(generateSupportResponse).not.toHaveBeenCalled();
  });

  it("persists ticket with validated AI fields to PostgreSQL", async () => {
    generateSupportResponse.mockResolvedValue({
      response: "We are investigating the API outage.",
      category: "Technical",
    });

    insertTicket.mockResolvedValue({
      id: 1,
      customerName: "Jane Doe",
      email: "jane@example.com",
      question: "I cannot log into my account.",
      aiResponse: "We are investigating the API outage.",
      category: "Technical",
      createdAt: "2026-08-13T00:00:00.000Z",
    });

    const res = mockRes();

    await createTicket({ body: validBody }, res);

    expect(generateSupportResponse).toHaveBeenCalledWith(validBody.question);
    expect(insertTicket).toHaveBeenCalledWith({
      customerName: "Jane Doe",
      email: "jane@example.com",
      question: "I cannot log into my account.",
      aiResponse: "We are investigating the API outage.",
      category: "Technical",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        aiResponse: "We are investigating the API outage.",
        category: "Technical",
      })
    );
  });

  it.each([
    ["Invalid AI category: bad value", "Invalid AI category: bad value"],
    ["AI returned invalid JSON", "AI returned invalid JSON"],
    ["AI response is missing", "AI response is missing"],
    ["Empty response from Gemini", "Empty response from Gemini"],
  ])("returns 502 when AI validation fails (%s)", async (errorMessage) => {
    generateSupportResponse.mockRejectedValue(new Error(errorMessage));

    const res = mockRes();

    await createTicket({ body: validBody }, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unable to generate a valid AI response. Please try again.",
    });
    expect(insertTicket).not.toHaveBeenCalled();
  });

  it.each([
    ["401 status", { status: 401, message: "Unauthorized" }],
    ["403 status", { status: 403, message: "Forbidden" }],
    ["invalid API key message", { message: "Invalid API key provided" }],
    ["permission denied message", { message: "PERMISSION_DENIED for project" }],
  ])("returns 502 with Gemini key guidance when auth fails (%s)", async (_label, error) => {
    generateSupportResponse.mockRejectedValue(error);

    const res = mockRes();

    await createTicket({ body: validBody }, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message:
        "Gemini API key is missing or invalid. Set GEMINI_API_KEY in backend/.env and restart the server.",
    });
  });

  it("returns 429 with a clean message when Gemini quota is exceeded", async () => {
    const quotaError = new Error(
      "You exceeded your current quota, please check your plan and billing details."
    );
    quotaError.status = 429;
    quotaError.error = {
      code: 429,
      message: "You exceeded your current quota...",
    };
    generateSupportResponse.mockRejectedValue(quotaError);

    const res = mockRes();

    await createTicket({ body: validBody }, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message:
        "AI service free quota has been exceeded. Please ask owner to change API key.",
    });
    expect(insertTicket).not.toHaveBeenCalled();
  });

  it("returns 503 when database is unavailable after a valid AI response", async () => {
    generateSupportResponse.mockResolvedValue({
      response: "Your refund is being processed.",
      category: "Billing",
    });

    const dbError = new Error("connection refused");
    dbError.code = "ECONNREFUSED";
    insertTicket.mockRejectedValue(dbError);

    const res = mockRes();

    await createTicket({ body: validBody }, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message:
        "Database is unavailable. Check PostgreSQL is running, DATABASE_URL in .env, and that support_ticket_db exists.",
    });
  });

  it("returns 500 for unexpected errors after AI succeeds", async () => {
    generateSupportResponse.mockResolvedValue({
      response: "Thanks for contacting support.",
      category: "General",
    });

    insertTicket.mockRejectedValue(new Error("Unexpected failure"));

    const res = mockRes();

    await createTicket({ body: validBody }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unable to create ticket. Please try again.",
    });
  });
});

describe("getTickets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns tickets from PostgreSQL", async () => {
    findAllTickets.mockResolvedValue([
      {
        id: 1,
        customerName: "Jane Doe",
        email: "jane@example.com",
        question: "Help",
        aiResponse: "Sure",
        category: "General",
        createdAt: "2026-08-13T00:00:00.000Z",
      },
    ]);

    const res = mockRes();
    await getTickets({}, res);

    expect(findAllTickets).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, customerName: "Jane Doe" }),
      ])
    );
  });

  it("returns 503 when database is unavailable", async () => {
    const dbError = new Error("connection refused");
    dbError.code = "ECONNREFUSED";
    findAllTickets.mockRejectedValue(dbError);

    const res = mockRes();
    await getTickets({}, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database is unavailable. Check PostgreSQL and DATABASE_URL.",
    });
  });
});
