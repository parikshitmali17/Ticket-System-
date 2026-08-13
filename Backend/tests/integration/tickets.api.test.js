jest.mock("../../src/services/aiService", () => ({
  generateSupportResponse: jest.fn(),
}));

jest.mock("../../src/services/ticketService", () => ({
  insertTicket: jest.fn(),
  findAllTickets: jest.fn(),
}));

const request = require("supertest");
const app = require("../../src/app");
const { generateSupportResponse } = require("../../src/services/aiService");
const { insertTicket, findAllTickets } = require("../../src/services/ticketService");

describe("POST /api/tickets AI response integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    customerName: "Jane Doe",
    email: "jane@example.com",
    question: "Why was I charged twice this month?",
  };

  it("returns 201 with aiResponse and category after saving to the database", async () => {
    generateSupportResponse.mockResolvedValue({
      response: "We will review your billing history and issue a refund if needed.",
      category: "Billing",
    });

    insertTicket.mockResolvedValue({
      id: 12,
      customerName: "Jane Doe",
      email: "jane@example.com",
      question: "Why was I charged twice this month?",
      aiResponse:
        "We will review your billing history and issue a refund if needed.",
      category: "Billing",
      createdAt: "2026-08-13T00:00:00.000Z",
    });

    const response = await request(app).post("/api/tickets").send(validPayload);

    expect(response.status).toBe(201);
    expect(insertTicket).toHaveBeenCalledWith({
      customerName: "Jane Doe",
      email: "jane@example.com",
      question: "Why was I charged twice this month?",
      aiResponse:
        "We will review your billing history and issue a refund if needed.",
      category: "Billing",
    });
    expect(response.body).toMatchObject({
      id: 12,
      customerName: "Jane Doe",
      email: "jane@example.com",
      question: "Why was I charged twice this month?",
      aiResponse:
        "We will review your billing history and issue a refund if needed.",
      category: "Billing",
    });
  });

  it("returns 502 when AI category validation fails", async () => {
    generateSupportResponse.mockRejectedValue(
      new Error('Invalid AI category: "Sales". Expected one of: Technical, Billing, Account, General')
    );

    const response = await request(app).post("/api/tickets").send(validPayload);

    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      success: false,
      message: "Unable to generate a valid AI response. Please try again.",
    });
    expect(insertTicket).not.toHaveBeenCalled();
  });

  it("returns 502 when AI returns invalid JSON", async () => {
    generateSupportResponse.mockRejectedValue(new Error("AI returned invalid JSON"));

    const response = await request(app).post("/api/tickets").send(validPayload);

    expect(response.status).toBe(502);
    expect(response.body.message).toBe(
      "Unable to generate a valid AI response. Please try again."
    );
  });

  it("does not persist a ticket when AI generation fails", async () => {
    generateSupportResponse.mockRejectedValue(new Error("AI response is missing"));

    const response = await request(app).post("/api/tickets").send(validPayload);

    expect(response.status).toBe(502);
    expect(insertTicket).not.toHaveBeenCalled();
  });

  it("returns 429 with a clean quota message and never exposes Google error details", async () => {
    const quotaError = new Error("You exceeded your current quota...");
    quotaError.status = 429;
    quotaError.error = {
      code: 429,
      message: "You exceeded your current quota...",
    };
    generateSupportResponse.mockRejectedValue(quotaError);

    const response = await request(app).post("/api/tickets").send(validPayload);

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      success: false,
      message:
        "AI service free quota has been exceeded. Please ask owner to change API key.",
    });
    expect(JSON.stringify(response.body)).not.toMatch(/exceeded your current quota/i);
    expect(insertTicket).not.toHaveBeenCalled();
  });

  it("lists tickets from PostgreSQL", async () => {
    findAllTickets.mockResolvedValue([
      {
        id: 12,
        customerName: "Jane Doe",
        email: "jane@example.com",
        question: "Why was I charged twice this month?",
        aiResponse:
          "We will review your billing history and issue a refund if needed.",
        category: "Billing",
        createdAt: "2026-08-13T00:00:00.000Z",
      },
    ]);

    const listed = await request(app).get("/api/tickets");

    expect(listed.status).toBe(200);
    expect(findAllTickets).toHaveBeenCalled();
    expect(listed.body).toHaveLength(1);
    expect(listed.body[0]).toMatchObject({
      id: 12,
      customerName: "Jane Doe",
      category: "Billing",
    });
  });
});
