import express from "express";
import ingredientsRoutes from "./api/ingredients.js";
import recipesRoutes from "./api/recipes.js";
import historyRoutes from "./api/history.js";
import searchRoutes from "./api/search.js";

const app = express.Router();

app.use("/", ingredientsRoutes);
app.use("/recipes", recipesRoutes);
app.use("/history", historyRoutes);
app.use("/search", searchRoutes);

export default app;
