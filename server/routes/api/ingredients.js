/* global process */
import express from "express";
import axios from "axios";
import { models } from "../../db.js";

const app = express.Router();

// Get Ingredients
app.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search Parameter is Required" });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/food/ingredients/search",
      {
        params: {
          query,
          number: 5,
          apiKey: process.env.SPOONACULAR_API_KEY,
          metaInformation: true,
        },
      }
    );

    if (!response.data.results || response.data.results.length === 0) {
      return res.json([]);
    }

    // Top 3 Results to Return
    const results = response.data.results.slice(0, 3);

    // Save search results to db
    try {
      await models.Search.create({
        query: query,
        results: JSON.stringify(results),
      });
    } catch (error) {
      console.error("Failed to Save Search Results to Database:", error);
    }

    res.json(results);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Failed to fetch Food Data" });
  }
});

// Get Ingredient Details
app.get("/details/:id", async (req, res) => {
  const { id } = req.params;

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
