import { beforeEach, describe, expect, it, vi } from "vitest";

const parseResponse = vi.hoisted(() => vi.fn());

vi.mock("openai", () => ({
  default: class OpenAIMock {
    responses = {
      parse: parseResponse,
    };
  },
}));

import { POST } from "@/app/api/debrief/route";

const endpoint = "http://localhost/api/debrief";
const sessionId = "123e4567-e89b-42d3-a456-426614174000";
const brief = {
  person: "A neighbor with a broken household item",
  situation: "They are checking from a phone before Saturday's event.",
  usefulResult: "They can decide whether to attend and email the organizer.",
  completePath: "Open the page, check the facts, then open a prepared email.",
  trustedFacts: [
    "Saturday, 10:00–14:00",
    "Repairs depend on volunteer availability",
  ],
  mustHave: ["Event facts", "A working email action", "A readable phone layout"],
  notNow: ["Accounts", "Live availability", "Donations"],
  doneWhen: "The facts match and the email action works at 390px.",
};

const liveResult = {
  clearStrength: "The brief names one person and one useful result.",
  unresolvedAssumptions: [
    "Who keeps the event facts current?",
    "Which visitor will try the path on a phone?",
  ],
  featureToPostpone: {
    feature: "Accounts",
    reason: "Identity adds recovery, permissions, and support work.",
  },
  toolTradeoff:
    "A repository-aware agent exposes the files but requires more setup.",
  nextMoves: [
    "Name the owner of every trusted fact.",
    "Ask for a plan before file changes.",
    "Build, check, and save one small step.",
  ],
};

function request(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function validBody(toolLane: "hosted" | "repository" = "repository") {
  return {
    sessionId,
    toolLane,
    firstVersionBrief: brief,
  };
}

describe("Teaching Mirror API", () => {
  beforeEach(() => {
    process.env.DEMO_MODE = "true";
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    parseResponse.mockReset();
  });

  it("returns the complete authored reflection without grading", async () => {
    const response = await POST(request(validBody()));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.mode).toBe("demo");
    expect(body).not.toHaveProperty("score");
    expect(body).not.toHaveProperty("level");
    expect(body.result.clearStrength).toContain(brief.usefulResult);
    expect(body.result.unresolvedAssumptions).toHaveLength(2);
    expect(body.result.featureToPostpone.feature).toBe("Accounts");
    expect(body.result.toolTradeoff).toContain("repository-aware");
    expect(body.result.nextMoves).toHaveLength(3);
  });

  it("changes the authored tradeoff for the hosted lane", async () => {
    const response = await POST(request(validBody("hosted")));
    const body = await response.json();

    expect(body.result.toolTradeoff).toContain("hosted builder");
    expect(body.result.toolTradeoff).toContain("export");
  });

  it("rejects extra fields and incomplete briefs", async () => {
    const extraField = await POST(
      request({ ...validBody(), score: 100 }),
    );
    const missingField = await POST(
      request({
        ...validBody(),
        firstVersionBrief: { ...brief, doneWhen: undefined },
      }),
    );

    expect(extraField.status).toBe(400);
    expect(missingField.status).toBe(400);
  });

  it("rejects out-of-bounds content", async () => {
    const tooManyFacts = await POST(
      request({
        ...validBody(),
        firstVersionBrief: {
          ...brief,
          trustedFacts: Array.from({ length: 9 }, (_, index) => `Fact ${index}`),
        },
      }),
    );
    const oversizedField = await POST(
      request({
        ...validBody(),
        firstVersionBrief: {
          ...brief,
          situation: "x".repeat(241),
        },
      }),
    );

    expect(tooManyFacts.status).toBe(400);
    expect(oversizedField.status).toBe(400);
  });

  it("rejects malformed JSON and oversized bodies", async () => {
    const malformed = await POST(
      new Request(endpoint, { method: "POST", body: "{" }),
    );
    const oversized = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: { "Content-Length": "12001" },
        body: JSON.stringify(validBody()),
      }),
    );

    expect(malformed.status).toBe(400);
    expect(oversized.status).toBe(413);
  });

  it("uses the bounded Responses API contract in live mode", async () => {
    process.env.DEMO_MODE = "false";
    process.env.OPENAI_API_KEY = "test-key";
    parseResponse.mockResolvedValue({
      status: "completed",
      error: null,
      output: [
        {
          type: "message",
          content: [{ type: "output_text", text: "structured" }],
        },
      ],
      output_parsed: liveResult,
    });

    const response = await POST(
      request(validBody(), { "x-real-ip": "198.51.100.42" }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ mode: "live", result: liveResult });
    expect(parseResponse).toHaveBeenCalledTimes(1);
    const parameters = parseResponse.mock.calls[0][0];
    expect(parameters.model).toBe("gpt-5.6");
    expect(parameters.store).toBe(false);
    expect(parameters.safety_identifier).toMatch(/^[a-f0-9]{64}$/);
    expect(parameters).not.toHaveProperty("tools");
    expect(parameters.input).toContain(brief.usefulResult);
    expect(parameters.instructions).toContain("Do not score, grade");
  });

  it("falls back safely when the live request is refused", async () => {
    process.env.DEMO_MODE = "false";
    process.env.OPENAI_API_KEY = "test-key";
    parseResponse.mockResolvedValue({
      status: "completed",
      error: null,
      output: [
        {
          type: "message",
          content: [{ type: "refusal", refusal: "Cannot help with that." }],
        },
      ],
      output_parsed: null,
    });

    const response = await POST(
      request(validBody("hosted"), { "x-real-ip": "198.51.100.43" }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.mode).toBe("demo");
    expect(body.result.unresolvedAssumptions).toHaveLength(2);
    expect(body.result.nextMoves).toHaveLength(3);
  });

  it("limits live model calls without removing the authored lesson", async () => {
    process.env.DEMO_MODE = "false";
    process.env.OPENAI_API_KEY = "test-key";
    parseResponse.mockResolvedValue({
      status: "completed",
      error: null,
      output: [
        {
          type: "message",
          content: [{ type: "output_text", text: "structured" }],
        },
      ],
      output_parsed: liveResult,
    });
    const headers = { "x-real-ip": "198.51.100.44" };

    const first = await POST(request(validBody(), headers));
    const second = await POST(request(validBody(), headers));
    const limited = await POST(request(validBody(), headers));
    const limitedBody = await limited.json();

    expect((await first.json()).mode).toBe("live");
    expect((await second.json()).mode).toBe("live");
    expect(limitedBody.mode).toBe("demo");
    expect(limitedBody.result.nextMoves).toHaveLength(3);
    expect(parseResponse).toHaveBeenCalledTimes(2);
  });
});
