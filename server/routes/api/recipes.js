/* global process */
import express from "express";
import axios from "axios";

const app = express.Router();

// Get Recipes by Ingredient
app.get("/by-ingredient/:ingredient", async (req, res) => {
  const { ingredient } = req.params;

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          ingredients: ingredient,
          number: 3,
          ranking: 1,
          ignorePantry: true,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Recipe Suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch Recipe Suggestions" });
  }
});

export default app;
