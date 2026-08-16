import type { Movie, ApiResponse, PaginatedResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<Movie[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/tmdb/search?query=${query}&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data = (await response.json()) as ApiResponse<Movie[]>;
  return data.data || [];
}

export async function getPopularMovies(
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const response = await fetch(
    `${API_BASE_URL}/api/tmdb/popular?page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies");
  }

  const data = await response.json();
  return data;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/api/tmdb/trending`);

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  const data = (await response.json()) as ApiResponse<Movie[]>;
  return data.data || [];
}

export async function getMovieDetails(id: number): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/tmdb/movie/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const data = (await response.json()) as ApiResponse<Movie>;
  return data.data!;
}