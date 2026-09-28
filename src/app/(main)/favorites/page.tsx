"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/movies/MovieCard";
import type { Movie } from "@/types";

interface Favorite {
  id: string;
  movieId: number;
  movie: Movie;
}

interface FavoritesResponse {
  success: boolean;
  data: Favorite[];
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function getFavorites() {
      try {
        const response = await fetch(`${apiUrl}/api/favorites`, {
          credentials: "include",
        });

        if (!response.ok) {
          setFavorites([]);
          return;
        }

        const data: FavoritesResponse = await response.json();

        setFavorites(data.success ? data.data : []);
      } catch (error) {
        console.error(error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }

    getFavorites();
  }, [apiUrl]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center text-4xl font-bold">
          Meus favoritos
        </h1>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-center text-gray-400">
              Carregando favoritos...
            </p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-center text-gray-400">
              Você ainda não possui filmes ou séries favoritos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((favorite) => (
              <MovieCard
                key={favorite.id}
                movie={favorite.movie}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}