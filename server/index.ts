import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "✅ Server is running" });
});

// Test TMDB
app.get("/api/test-tmdb", async (req, res) => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.TMDB_API_BASE_URL;

  if (!apiKey || !baseUrl) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  try {
    const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "TMDB API error" });
    }

    const data = await response.json();
    res.json({
      success: true,
      message: `✅ TMDB API Working! Found ${data.results.length} movies`,
      movieCount: data.results.length,
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});