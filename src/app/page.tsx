"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/movies/MovieCard";
import type { Movie } from "@/types";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        
        const moviesRes = await fetch(`${apiUrl}/api/tmdb/trending`);
        const moviesData = await moviesRes.json();
        setMovies(moviesData.data || []);

        const seriesRes = await fetch(`${apiUrl}/api/tmdb/trending-series`);
        const seriesData = await seriesRes.json();
        setSeries(seriesData.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-400">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Filmes em Tendência</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <h2 className="text-4xl font-bold mb-8">Séries em Tendência</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {series.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      </div>
    </main>
  );
}