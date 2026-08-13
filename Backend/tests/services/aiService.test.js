const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
  Type: {
    OBJECT: "object",
    STRING: "string",
  },
}));

const {
  validateCategory,
  generateSupportResponse,
  ALLOWED_CATEGORIES,
} = require("../../src/services/aiService");

describe("validateCategory", () => {
  it.each(ALLOWED_CATEGORIES)(
    "accepts allowed category %s",
    (category) => {
      expect(validateCategory(category)).toBe(category);
    }
  );

  it("trims whitespace from valid categories", () => {
    expect(validateCategory("  Technical  ")).toBe("Technical");
    expect(validateCategory("\tBilling\n")).toBe("Billing");
  });

  it("rejects non-string category values", () => {
    expect(() => validateCategory(null)).toThrow(
      "Invalid AI category: category must be a string"
    );
    expect(() => validateCategory(undefined)).toThrow(
      "Invalid AI category: category must be a string"
    );
    expect(() => validateCategory(123)).toThrow(
      "Invalid AI category: category must be a string"
    );
    expect(() => validateCategory({ name: "Technical" })).toThrow(
      "Invalid AI category: category must be a string"
    );
  });

  it("rejects categories outside the allowlist", () => {
    expect(() => validateCategory("Support")).toThrow(
      'Invalid AI category: "Support". Expected one of: Technical, Billing, Account, General'
    );
    expect(() => validateCategory("technical")).toThrow(
      'Invalid AI category: "technical". Expected one of: Technical, Billing, Account, General'
    );
  });

  it("rejects empty or whitespace-only categories", () => {
    expect(() => validateCategory("")).toThrow(
      'Invalid AI category: "". Expected one of: Technical, Billing, Account, General'
    );
    expect(() => validateCategory("   ")).toThrow(
      'Invalid AI category: "". Expected one of: Technical, Billing, Account, General'
    );
  });
});

describe("generateSupportResponse", () => {
  const originalApiKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-gemini-key";
    mockGenerateContent.mockReset();
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalApiKey;
  });

  it.each([
    ["placeholder your_api_key", "your_api_key"],
    ["placeholder your_gemini_api_key", "your_gemini_api_key"],
  ])("rejects when API key is %s", async (_label, apiKeyValue) => {
    process.env.GEMINI_API_KEY = apiKeyValue;

    await expect(generateSupportResponse("How do I reset my password?")).rejects.toMatchObject({
      message: expect.stringContaining("GEMINI_API_KEY is missing or invalid"),
      status: 401,
    });

    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it("rejects when API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(generateSupportResponse("How do I reset my password?")).rejects.toMatchObject({
      message: expect.stringContaining("GEMINI_API_KEY is missing or invalid"),
      status: 401,
    });

    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it("returns validated category and trimmed response on valid Gemini JSON", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        category: "Account",
        response: "  You can reset your password from the login page.  ",
      }),
    });

    const result = await generateSupportResponse("I forgot my password");

    expect(result).toEqual({
      category: "Account",
      response: "You can reset your password from the login page.",
    });
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-3.5-flash",
        contents: "I forgot my password",
        config: expect.objectContaining({
          responseMimeType: "application/json",
          responseSchema: expect.objectContaining({
            properties: expect.objectContaining({
              category: expect.objectContaining({
                enum: [...ALLOWED_CATEGORIES],
              }),
            }),
          }),
        }),
      })
    );
  });

  it.each([
    ["Technical", "Our team is investigating the outage."],
    ["Billing", "Your refund will appear within 5-7 business days."],
    ["Account", "Use the forgot-password link on the sign-in page."],
    ["General", "You can find setup steps in our help center."],
  ])("accepts Gemini category %s with a non-empty response", async (category, response) => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({ category, response }),
    });

    const result = await generateSupportResponse("Customer question");

    expect(result).toEqual({ category, response });
  });

  it("rejects empty Gemini text", async () => {
    mockGenerateContent.mockResolvedValue({ text: "" });

    await expect(generateSupportResponse("Any question")).rejects.toThrow(
      "Empty response from Gemini"
    );
  });

  it("rejects missing Gemini text property", async () => {
    mockGenerateContent.mockResolvedValue({});

    await expect(generateSupportResponse("Any question")).rejects.toThrow(
      "Empty response from Gemini"
    );
  });

  it("rejects invalid JSON from Gemini", async () => {
    mockGenerateContent.mockResolvedValue({ text: "not-json" });

    await expect(generateSupportResponse("Any question")).rejects.toThrow(
      "AI returned invalid JSON"
    );
  });

  it.each([
    ["missing response field", { category: "General" }],
    ["empty response string", { category: "General", response: "" }],
    ["whitespace-only response", { category: "General", response: "   " }],
    ["non-string response", { category: "General", response: 42 }],
  ])("rejects when AI response is %s", async (_label, payload) => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(payload),
    });

    await expect(generateSupportResponse("Any question")).rejects.toThrow(
      "AI response is missing"
    );
  });

  it("rejects invalid category even when response text is present", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        category: "Urgent",
        response: "We will help you shortly.",
      }),
    });

    await expect(generateSupportResponse("Help me now")).rejects.toThrow(
      'Invalid AI category: "Urgent". Expected one of: Technical, Billing, Account, General'
    );
  });

  it("rejects category with only different casing from allowlist", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        category: "billing",
        response: "Please check your invoice history.",
      }),
    });

    await expect(generateSupportResponse("Where is my invoice?")).rejects.toThrow(
      'Invalid AI category: "billing"'
    );
  });
});
