import request from "supertest";
import { app } from "../../index.js";
import axios from "axios";
import { models } from "../../db.js";
import { saveSearchToFile } from "../../utils/searchHelpers.js";

// Mock dependencies
jest.mock("axios");
jest.mock("../../db.js", () => ({
  models: {
    Search: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
    },
  },
}));
jest.mock("../../utils/searchHelpers.js", () => ({
  saveSearchToFile: jest.fn().mockResolvedValue({ success: true }),
}));

describe("Recipes API Endpoints", () => {
  const mockRecipesByIngredientResponse = {
    data: [
      {
        id: 123,
        title: "Apple Pie",
        image: "apple-pie.jpg",
        missedIngredientCount: 3,
        usedIngredientCount: 1,
        likes: 50,
        missedIngredients: [{ name: "sugar" }, { name: "flour" }],
        usedIngredients: [{ name: "apple" }],
      },
    ],
  };

  const mockRecipeDetailResponse = {
    data: {
      id: 123,
      title: "Apple Pie",
      instructions: "Bake until golden brown",
      nutrition: { nutrients: [{ name: "Calories", amount: 300 }] },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /by-ingredient/:ingredient should return recipes", async () => {
    // Mock axios for recipe search
    axios.get.mockResolvedValueOnce(mockRecipesByIngredientResponse);

    const response = await request(app).get("/api/recipes/by-ingredient/apple");

    // Should call Spoonacular API
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.spoonacular.com/recipes/findByIngredients",
      expect.any(Object)
    );

    // Should save search to database
    expect(models.Search.create).toHaveBeenCalled();

    // Should return formatted recipes
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const recipe = response.body[0];
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("title");
      expect(recipe).toHaveProperty("missedIngredients");
      expect(recipe).toHaveProperty("usedIngredients");
    }
  });

  test("GET /by-ingredient/:ingredient should handle missing ingredient parameter", async () => {
    const response = await request(app).get("/api/recipes/by-ingredient/");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("GET /by-ingredient/:ingredient should handle database errors", async () => {
    // Mock axios response
    axios.get.mockResolvedValueOnce(mockRecipesByIngredientResponse);

    // Mock database error
    models.Search.create.mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).get("/api/recipes/by-ingredient/apple");

    // Should attempt to save to file when DB fails
    expect(saveSearchToFile).toHaveBeenCalled();

    // Should still return results despite DB error
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /:id should return recipe details", async () => {
    // Mock axios for recipe details
    axios.get.mockResolvedValueOnce(mockRecipeDetailResponse);

    const response = await request(app).get("/api/recipes/123");

    // Should call Spoonacular API
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.spoonacular.com/recipes/123/information",
      expect.any(Object)
    );

    // Should return recipe details
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("nutrition");
  });

  test("GET /:id should handle missing ID parameter", async () => {
    const response = await request(app).get("/api/recipes/");

    expect(response.status).toBe(404); // Route not found
  });

  test("GET /by-ingredient/:ingredient should handle API errors", async () => {
    // Mock API error
    axios.get.mockRejectedValueOnce(new Error("API error"));

    const response = await request(app).get("/api/recipes/by-ingredient/apple");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
