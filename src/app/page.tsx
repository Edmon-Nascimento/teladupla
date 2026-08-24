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
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        const moviesRes = await fetch(`${apiUrl}/api/tmdb/trending`);
        const moviesData = await moviesRes.json();

        setMovies(moviesData.data || []);

        const seriesRes = await fetch(
          `${apiUrl}/api/tmdb/trending-series`,
        );
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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-base text-slate-400">
          Carregando...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white">
      <div className="w-full max-w-375 px-3 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <section>
          <h1 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl lg:mb-10">
            Filmes em Tendência
          </h1>

          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-8
              sm:grid-cols-3
              sm:gap-x-5
              sm:gap-y-10
              md:grid-cols-4
              lg:grid-cols-5
              lg:gap-x-8
              lg:gap-y-12
            "
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        </section>

        <section className="mt-24 lg:mt-32">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl lg:mb-10">
            Séries em Tendência
          </h2>

          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-8
              sm:grid-cols-3
              sm:gap-x-5
              sm:gap-y-10
              md:grid-cols-4
              lg:grid-cols-5
              lg:gap-x-8
              lg:gap-y-12
            "
          >
            {series.map((show) => (
              <MovieCard
                key={show.id}
                movie={show}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}