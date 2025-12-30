import request from "supertest";
import { app } from "../../index.js";
import { models } from "../../db.js";
import { getSearchesFromFiles } from "../../utils/searchHelpers.js";

jest.mock("../../db.js", () => ({
  models: {
    Search: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock("../../utils/searchHelpers.js", () => ({
  getSearchesFromFiles: jest.fn(),
  safeJsonParse: (value) => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
      return null;
    }
  },
}));

describe("History API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /history returns timestamp and parsed results", async () => {
    models.Search.findAll.mockResolvedValueOnce([
      {
        toJSON: () => ({
          id: 1,
          query: "apple",
          results: "[]",
          created_at: new Date("2025-01-01T00:00:00.000Z"),
        }),
      },
    ]);

    const response = await request(app).get("/api/search/history");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("timestamp");
    expect(response.body[0]).toHaveProperty("results");
    expect(Array.isArray(response.body[0].results)).toBe(true);
  });

  test("GET /history falls back to file storage if DB fails", async () => {
    models.Search.findAll.mockRejectedValueOnce(new Error("DB error"));
    getSearchesFromFiles.mockResolvedValueOnce([
      {
        query: "apple",
        results: "[]",
        created_at: "2025-01-01T00:00:00.000Z",
      },
    ]);

    const response = await request(app).get("/api/search/history");

    expect(response.status).toBe(200);
    expect(getSearchesFromFiles).toHaveBeenCalled();
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("timestamp");
  });
});

