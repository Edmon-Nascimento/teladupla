import type { Request, Response } from "express";
import { Router } from "express";
import { createOrUpdateMovie } from "../db";
import type { Movie } from "../types";

const router = Router();

const TMDB_BASE_URL =
  process.env.TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genres?: Array<{ name: string }>;
  media_type?: string;
  [key: string]: unknown;
}

interface TMDBResponse {
  results: TMDBMovie[];
  total_results: number;
  page: number;
}

type NormalizedTMDBMovie = Omit<TMDBMovie, "genres"> & {
  posterPath?: string;
  mediaType?: "movie" | "tv";
  releaseDate?: string;
  rating?: number;
  genres: string[];
};

function normalizeTitle(
  item: TMDBMovie,
  mediaType?: "movie" | "tv",
): NormalizedTMDBMovie {
  return {
    ...item,
    title: (item.title || item.name) as string,
    posterPath: item.poster_path,
    mediaType: mediaType || (item.media_type as "movie" | "tv" | undefined),
    releaseDate: item.release_date || item.first_air_date,
    rating: item.vote_average,
    genres: item.genres?.map((genre) => genre.name) || [],
  };
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
      data: data.results
        .filter(
          (r: TMDBMovie) => r.media_type === "movie" || r.media_type === "tv",
        )
        .map((item) => normalizeTitle(item)),
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
      data: data.results.map((item) => normalizeTitle(item)),
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
      data: data.results.map((item) => normalizeTitle(item)),
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch trending",
    });
  }
});

// Get trending series
router.get("/trending-series", async (req: Request, res: Response) => {
  try {
    const url = `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const response = await fetch(url);
    const data = (await response.json()) as TMDBResponse;

    res.json({
      success: true,
      data: data.results.map((item) => normalizeTitle(item, "tv")),
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch trending series",
    });
  }
});

// Get movie details
router.get("/movie/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mediaType = req.query.type === "tv" ? "tv" : "movie";

    const url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const response = await fetch(url);
    const data = (await response.json()) as TMDBMovie;

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Movie not found on TMDB",
      });
    }

    const movie = normalizeTitle(data, mediaType);

    if (process.env.DATABASE_URL) {
      try {
        await createOrUpdateMovie({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.posterPath,
          releaseDate: movie.releaseDate,
          rating: movie.rating,
          genres: movie.genres,
        } as Movie);
      } catch (error) {
        console.error("Failed to save movie details:", error);
      }
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch movie details",
    });
  }
});

export default router;
