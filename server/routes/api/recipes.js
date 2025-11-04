/* global process */
import express from "express";
import axios from "axios";
import { models } from "../../db.js";
import { saveSearchToFile } from "../../utils/searchHelpers.js";

const app = express.Router();

// Get Recipes by Ingredient
app.get("/by-ingredient/:ingredient", async (req, res) => {
  const { ingredient } = req.params;

  // Basic validation to ensure presence and reasonable length.
  if (!ingredient || ingredient.trim() === "") {
    return res.status(400).json({ error: "Ingredient Parameter is Required!" });
  }
  if (ingredient.length > 100) {
    return res.status(400).json({ error: "Ingredient Too Long (max 100 chars)" });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          ingredients: ingredient,
          number: 3,
          ranking: 1, // Sort by minimizing missing ingredients
          ignorePantry: true,
        },
      }
    );

    // Format Response Data for Recipe List
    const formattedRecipes = response.data.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      missedIngredientCount: recipe.missedIngredientCount,
      usedIngredientCount: recipe.usedIngredientCount,
      likes: recipe.likes,
      missedIngredients: recipe.missedIngredients.map((ing) => ing.name),
      usedIngredients: recipe.usedIngredients.map((ing) => ing.name),
    }));

    // Save query to Search History
    const searchData = {
      query: `recipe:${ingredient}`,
      results: JSON.stringify(formattedRecipes),
      created_at: new Date(),
    };

    try {
      await models.Search.create(searchData);
    } catch (dbError) {
      console.error("Database Error Saving Recipe Search:", dbError);

      // Backup to file if DB fails
      const fileResult = await saveSearchToFile(searchData);
      if (!fileResult.success) {
        console.error(
          "File Backup for Recipe Search Failed:",
          fileResult.error
        );
      }
    }

    return res.json(formattedRecipes);
  } catch (error) {
    console.error("Recipe Search Error:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to Fetch Recipe Suggestions" });
  }
});

// Get Recipe Details by ID
app.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Ensure numeric ID to prevent malformed requests
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "Recipe ID is Required!!!!" });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("Recipe Detail Error:", error.message);
    return res.status(500).json({ error: "Failed to Fetch Recipe Details" });
  }
});

export default app;
