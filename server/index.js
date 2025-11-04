/* global process */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import apiRoutes from "./routes/index.js";

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from root directory .env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Init express app
const app = express();

// Security hardening: remove the "X-Powered-By: Express" header to avoid
// revealing framework details to clients/scanners.
app.disable("x-powered-by");

// Middleware
// CORS: restrict allowed origins via env list while still allowing
// same-origin/non-browser requests (no Origin header).
// Example: ALLOWED_ORIGINS="http://localhost:5173,https://app.example.com"
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow same-origin/non-browser
      return cb(null, allowedOrigins.includes(origin));
    },
    // We don't use cookies/auth, so no need to allow credentials.
    // Keeping this off reduces risk of misconfigured cross-site cookies.
    credentials: false,
    methods: ["GET"], // Only GET routes are exposed by this API
  })
);

// Limit body size to mitigate abuse and accidental large payloads.
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

// API Routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

export { app, server };
