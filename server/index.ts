import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tmdbRouter from "./src/routes/tmdb";
import { errorHandler } from "./src/middleware/errorHandler";
import authRouter from "./src/routes/auth";
import cookieParser from "cookie-parser";
import type { AuthenticatedRequest } from "./src/middleware/auth";
import { authMiddleware } from "./src/middleware/auth";

dotenv.config({ path: "../.env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.get(
  "/api/auth/me-test",
  authMiddleware,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      data: {
        userId: req.userId,
        email: req.userEmail,
      },
    });
  },
);


// TMDB routes
app.use("/api/tmdb", tmdbRouter);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});