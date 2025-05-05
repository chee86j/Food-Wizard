import express from "express";
import { models } from "../../db.js";
import {
  saveSearchToFile,
  getSearchesFromFiles,
  safeJsonParse,
} from "../../utils/searchHelpers.js";

const app = express.Router();

// GET Search Results
app.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const results = [];

    // Save to DB
    const searchData = {
      query,
      results: JSON.stringify(results),
      created_at: new Date(),
    };

    try {
      await models.Search.create(searchData);
    } catch (dbError) {
      console.error("Database Error Encountered Saving Search:", dbError);

      // Backup to File if DB Fails
      const fileResult = await saveSearchToFile(searchData);
      if (!fileResult.success) {
        console.error("File Backup Failed:", fileResult.error);
      }
    }

    return res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "An error Occurred During Search" });
  }
});

// GET Search History from DB or File
app.get("/history", async (req, res) => {
  try {
    let searchHistory = [];

    try {
      searchHistory = await models.Search.findAll({
        order: [["created_at", "DESC"]],
        limit: 20,
      });
    } catch (dbError) {
      console.error("Database error when Fetching Search History:", dbError);

      searchHistory = await getSearchesFromFiles();
    }

    // Format Conversion
    const formattedHistory = searchHistory.map((search) => {
      const item = search.toJSON ? search.toJSON() : search;

      // Ensure the timestamp is properly formatted
      let timestamp;
      if (item.created_at) {
        // If it's a Date object, convert to ISO string
        timestamp =
          item.created_at instanceof Date
            ? item.created_at.toISOString()
            : item.created_at;
      } else {
        // If no timestamp exists, use current time
        timestamp = new Date().toISOString();
      }

      return {
        id: item.id || `file-${Date.now()}`,
        query: item.query,
        results: safeJsonParse(item.results) || [],
        timestamp: timestamp,
      };
    });

    return res.json(formattedHistory);
  } catch (error) {
    console.error("Error Retrieving Search History:", error);
    return res
      .status(500)
      .json({ error: "An Error occurred Retrieving Search History" });
  }
});

export default app;
