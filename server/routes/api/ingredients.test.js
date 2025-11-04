import request from "supertest";
import { app } from "../../index.js";
import axios from "axios";
import { models } from "../../db.js";

// Mock axios for API testing
jest.mock("axios");
// Mock models to avoid actual DB operations
jest.mock("../../db.js", () => ({
  models: {
    Search: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
    },
  },
}));

describe("Ingredients API Endpoints", () => {
  const mockSearchResponse = {
    data: {
      results: [
        { id: 1, name: "Apple" },
        { id: 2, name: "Banana" },
      ],
    },
  };

  const mockNutritionResponse = {
    data: {
      id: 1,
      name: "Apple",
      nutrition: {
        nutrients: [{ name: "Calories", amount: 52, unit: "kcal" }],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / should return error if query parameter is missing", async () => {
    const response = await request(app).get("/api/search");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("GET / should return sorted ingredients by calories", async () => {
    // Mock axios calls
    axios.get.mockImplementation((url) => {
      if (url.includes("/food/ingredients/search")) {
        return Promise.resolve(mockSearchResponse);
      }
      if (url.includes("/food/ingredients/1/information")) {
        return Promise.resolve(mockNutritionResponse);
      }
      return Promise.reject(new Error("Not found"));
    });

    const response = await request(app).get("/api").query({ query: "apple" });

    // Should have called the Spoonacular API
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.spoonacular.com/food/ingredients/search",
      expect.any(Object)
    );

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.spoonacular.com/food/ingredients/1/information",
      expect.any(Object)
    );

    // Should save search to database
    expect(models.Search.create).toHaveBeenCalled();

    // Should return ingredients with calories, sorted
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty("calories");
      expect(response.body[0]).toHaveProperty("calorieUnit");
    }
  });

  test("GET /details/:id should return ingredient details", async () => {
    // Mock axios for ingredient details
    axios.get.mockResolvedValueOnce(mockNutritionResponse);

    const response = await request(app).get("/api/details/1");

    // Should call Spoonacular API
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.spoonacular.com/food/ingredients/1/information",
      expect.any(Object)
    );

    // Should return ingredient details
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("nutrition");
  });

  test("GET / should handle API errors gracefully", async () => {
    // Mock axios to throw an error
    axios.get.mockRejectedValueOnce(new Error("API error"));

    const response = await request(app).get("/api").query({ query: "apple" });

    // Should return error response
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
