import express from "express";
import { models } from "../../db.js";

const app = express.Router();

// GET Search History of Last 5 Searches
app.get("/", async (req, res) => {
  try {
    const searches = await models.Search.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    const formattedSearches = searches.map((search) => ({
      id: search.id,
      query: search.query,
      results: JSON.parse(search.results),
      created_at: search.created_at,
    }));

    res.json(formattedSearches);
  } catch (error) {
    console.error("Error fetching Search History:", error);
    res.status(500).json({ error: "Failed to fetch Search History" });
  }
});

export default app;
