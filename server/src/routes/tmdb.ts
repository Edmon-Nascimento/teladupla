import type { Request, Response } from "express";
import { Router } from "express";
import { createOrUpdateMovie } from "../db";
import type { Movie } from "../types";

const router = Router();

const TMDB_BASE_URL = process.env.TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ name: string }>;
  media_type?: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
  total_results: number;
  page: number;
}

// Search movies
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter is required",
      });
    }

    const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}&page=${page}&language=pt-BR`;
    const response = await fetch(url);
    const data = (await response.json()) as TMDBResponse;

    res.json({
      success: true,
      data: data.results.filter(
        (r: TMDBMovie) => r.media_type === "movie" || r.media_type === "tv"
      ),
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to search TMDB",
    });
  }
});

// Get popular movies
router.get("/popular", async (req: Request, res: Response) => {
  try {
    const { page = 1 } = req.query;

    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=pt-BR`;
    const response = await fetch(url);
    const data = (await response.json()) as TMDBResponse;

    res.json({
      success: true,
      data: data.results,
      total: data.total_results,
      page: data.page,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular movies",
    });
  }
});

// Get trending movies
router.get("/trending", async (req: Request, res: Response) => {
  try {
    const url = `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const response = await fetch(url);
    const data = (await response.json()) as TMDBResponse;

    res.json({
      success: true,
      data: data.results,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch trending",
    });
  }
});

// Get movie details
router.get("/movie/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const response = await fetch(url);
    const data = (await response.json()) as TMDBMovie;

    // Salvar no banco se não existir
    if (response.ok) {
      const movieData: Movie = {
        id: data.id,
        title: data.title,
        overview: data.overview,
        posterPath: data.poster_path,
        releaseDate: data.release_date,
        rating: data.vote_average,
        genres: data.genres.map((g) => g.name),
      };
      await createOrUpdateMovie(movieData);
    }

    res.json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch movie details",
    });
  }
});

export default router;