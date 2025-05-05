/* global process */
import express from "express";

const app = express.Router();

// Server Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
  });
});

export default app;
