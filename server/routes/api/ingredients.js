/* global process */
import express from "express";
import axios from "axios";
import { models } from "../../db.js";

const app = express.Router();

// Get Ingredients
app.get("/", async (req, res) => {
  const { query } = req.query;

  // Minimal server-side validation: ensure string and reasonable length.
  if (typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Search Parameter is Required" });
  }
  if (query.length > 100) {
    return res.status(400).json({ error: "Query Too Long (max 100 chars)" });
  }

  try {
    // Get Initial Search Results
    const searchResponse = await axios.get(
      "https://api.spoonacular.com/food/ingredients/search",
      {
        params: {
          query,
          number: 20,
          apiKey: process.env.SPOONACULAR_API_KEY,
          metaInformation: true,
        },
      }
    );

    if (
      !searchResponse.data.results ||
      searchResponse.data.results.length === 0
    ) {
      return res.json([]);
    }

    const ingredientsWithCalories = [];

    // Process 10 or Less Search Results
    const itemsToProcess = Math.min(searchResponse.data.results.length, 10);

    for (let i = 0; i < itemsToProcess; i++) {
      const ingredient = searchResponse.data.results[i];
      try {
        const nutritionResponse = await axios.get(
          `https://api.spoonacular.com/food/ingredients/${ingredient.id}/information`,
          {
            params: {
              apiKey: process.env.SPOONACULAR_API_KEY,
              amount: 1,
              includeNutrition: true,
              unit: "serving",
            },
          }
        );

        // Find Calories in Nutrition Data
        const nutritionData = nutritionResponse.data.nutrition;
        const caloriesInfo = nutritionData?.nutrients?.find(
          (n) => n.name === "Calories"
        );

        if (caloriesInfo) {
          ingredientsWithCalories.push({
            ...ingredient,
            calories: caloriesInfo.amount,
            calorieUnit: caloriesInfo.unit,
            nutritionData: nutritionData,
          });
        }
      } catch (error) {
        console.error(
          `Error fetching nutrition for ingredient ${ingredient.id}:`,
          error.message
        );
      }
    }

    // Sort by Calories (Lowest First)
    ingredientsWithCalories.sort((a, b) => a.calories - b.calories);

    // Get the 3 Least Calorie-dense Foods
    const leastCalorieFoods = ingredientsWithCalories.slice(0, 3);

    // Save Search Results to DB
    try {
      await models.Search.create({
        query: query,
        results: JSON.stringify(leastCalorieFoods),
      });
    } catch (error) {
      console.error("Failed to Save Search Results to Database:", error);
    }

    res.json(leastCalorieFoods);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Failed to fetch Food Data" });
  }
});

// Get Ingredient Details
app.get("/details/:id", async (req, res) => {
  const { id } = req.params;

  // Ensure numeric ID to prevent malformed requests
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "Invalid Ingredient ID" });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/${id}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          amount: 1,
          includeNutrition: true,
          unit: "serving",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching food details:", error.message);
    res.status(500).json({ error: "Failed to fetch Food Details" });
  }
});

export default app;
