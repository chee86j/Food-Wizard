import express from "express";
import healthRoutes from "./health.js";
import searchRoutes from "./search.js";

const app = express.Router();

// Route Redirects
app.use("/health", healthRoutes);
app.use("/search", searchRoutes);

export default app;
