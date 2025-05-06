// Helper Functions for File Operations: Get & Save Searches,
// Check Storage Dir, Parse JSON
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.join(__dirname, "../storage/searches");

/* Helper Functions for File Ops - This is used to save search results to a file as a backup
 */
export const saveSearchToFile = async (searchData) => {
  try {
    const filename = `${Date.now()}_${searchData.query.replace(
      /[^a-z0-9]/gi,
      "_"
    )}.json`;
    const filePath = path.join(STORAGE_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(searchData), "utf8");
    return { success: true, filePath };
  } catch (error) {
    console.error("Error Saving Search:", error);
    return { success: false, error };
  }
};

export const getSearchesFromFiles = async () => {
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const searches = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        searches.push(JSON.parse(fileContent));
      }
    }

    return searches;
  } catch (error) {
    console.error("Error reading searches from files:", error);
    return [];
  }
};

// Checking if Storage Directory Exists
export const ensureStorageDir = async () => {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    // Directory doesn't exist, create it
    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
      console.log("Search storage directory created successfully");
    } catch (err) {
      console.error("Error creating search storage directory:", err);
    }
  }
};

// Parse JSON Safely
export const safeJsonParse = (jsonString) => {
  try {
    return typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};

ensureStorageDir();
