import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tmdbRouter from "./src/routes/tmdb";
import { errorHandler } from "./src/middleware/errorHandler";

dotenv.config({ path: "../.env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// TMDB routes
app.use("/api/tmdb", tmdbRouter);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});