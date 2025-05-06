import express from "express";
import recipesApiRoutes from "./api/recipes.js";

const app = express.Router();

// Redirect all requests to API routes
app.use("/", recipesApiRoutes);

export default app;
