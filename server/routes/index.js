import express from "express";
import healthRoutes from "./health.js";
import searchRoutes from "./search.js";
import recipesRoutes from "./recipes.js";

const app = express.Router();

// Route Redirects
app.use("/health", healthRoutes);
app.use("/search", searchRoutes);
app.use("/recipes", recipesRoutes);

export default app;
