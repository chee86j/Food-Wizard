import express from "express";
import { models } from "../../db.js";
import {
  getSearchesFromFiles,
  safeJsonParse,
} from "../../utils/searchHelpers.js";

const app = express.Router();

// GET Search History of Last 20 Searches
app.get("/", async (req, res) => {
  try {
    let searches = [];

    try {
      searches = await models.Search.findAll({
        order: [["created_at", "DESC"]],
        limit: 20,
      });
    } catch (dbError) {
      console.error("Database Error when Fetching Search History:", dbError);
      searches = await getSearchesFromFiles();
    }

    const formattedSearches = searches.map((search, index) => {
      const item = search?.toJSON ? search.toJSON() : search;

      let timestamp;
      if (item.created_at) {
        timestamp =
          item.created_at instanceof Date
            ? item.created_at.toISOString()
            : item.created_at;
      } else if (item.timestamp) {
        timestamp = item.timestamp;
      } else {
        timestamp = new Date().toISOString();
      }

      return {
        id: item.id || `file-${timestamp}-${index}`,
        query: item.query,
        results: safeJsonParse(item.results) || [],
        timestamp,
      };
    });

    res.json(formattedSearches);
  } catch (error) {
    console.error("Error fetching Search History:", error);
    res.status(500).json({ error: "Failed to fetch Search History" });
  }
});

export default app;
