"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import MovieCard from "@/components/movies/MovieCard";

import type { Movie } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const displayedResults = query ? results : [];

  useEffect(() => {
    if (!query) {
      return;
    }

    async function searchMovies() {
      try {
        setLoading(true);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        const response = await fetch(
          `${apiUrl}/api/tmdb/search?query=${encodeURIComponent(query)}`,
        );

        const data = await response.json();

        setResults(data.data || []);
      } catch (error) {
        console.error("Failed to search movies:", error);
      } finally {
        setLoading(false);
      }
    }

    searchMovies();
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
        {query && (
          <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
            Resultados para &quot;{query}&quot;
          </h1>
        )}

        {!query && (
          <p className="text-center text-slate-400">
            Digite um filme ou série para buscar.
          </p>
        )}

        {loading && (
          <p className="text-center text-slate-400">
            Carregando...
          </p>
        )}

        {query && !loading && displayedResults.length === 0 && (
          <p className="text-center text-slate-400">
            Nenhum resultado encontrado para &quot;{query}&quot;.
          </p>
        )}

        {!loading && displayedResults.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(5,250px)] lg:justify-center lg:gap-x-8 lg:gap-y-12">
            {displayedResults.map((movie) => (
              <MovieCard
                key={`${movie.mediaType}-${movie.id}`}
                movie={movie}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <p className="text-slate-400">
            Carregando...
          </p>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}