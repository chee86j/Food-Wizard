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
      // Prefer DB records for the most recent history.
      searches = await models.Search.findAll({
        order: [["created_at", "DESC"]],
        limit: 20,
      });
    } catch (dbError) {
      console.error("Database Error when Fetching Search History:", dbError);
      // Fall back to file-backed history if DB access fails.
      searches = await getSearchesFromFiles();
    }

    // Normalize DB/file entries into a consistent response shape.
    const formattedSearches = searches.map((search, index) => {
      const item = search?.toJSON ? search.toJSON() : search;

      // Resolve a stable timestamp from the record or use "now".
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
        // Parse stored JSON results or default to an empty list.
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
