import express from "express";
import ingredientsRoutes from "./api/ingredients.js";
import recipesRoutes from "./api/recipes.js";
import historyRoutes from "./api/history.js";

const app = express.Router();

app.use("/", ingredientsRoutes);
app.use("/recipes", recipesRoutes);
app.use("/history", historyRoutes);

export default app;
