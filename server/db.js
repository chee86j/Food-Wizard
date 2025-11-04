/* global process */
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // So I can use __dirname
import initModels from "./models/index.js";

// Directory Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Env Variables from Root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Prefer a single PG connection string if provided, with a safe fallback
// to discrete parts. This helps keep secrets in one place and supports
// managed DB providers easily.
const DB_NAME = process.env.DB_NAME || "food_wizard_db";
const DB_USER = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 5432;

const connectionString =
  process.env.PG_URI ||
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Init Sequelize Instance
const sequelize = new Sequelize(connectionString, {
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production",
  },
});

// Mock Models for Fallback if DB Connection Fails
const createMockModels = () => {
  return {
    Search: {
      findAll: async () => [],
      create: async () => ({
        id: 1,
        query: "mock",
        results: "[]",
        created_at: new Date(),
      }),
    },
  };
};

// Init models
let models;
try {
  models = initModels(sequelize);
} catch (error) {
  console.error("Error initializing models:", error);
  models = createMockModels();
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully to", DB_NAME);

    // Only auto-sync/alter in non-production to avoid unsafe migrations.
    await sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
    console.log("Database Models Synced");

    return true;
  } catch (error) {
    // Log error name/message instead of full object to reduce sensitive output
    console.error("Error connecting to Database:", error?.name, error?.message);

    // Replace Models w/mock Implementations in case of DB Error
    models = createMockModels();
    return false;
  }
};

export { sequelize, connectDB, models };
