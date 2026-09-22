"use client";

import { useState } from "react";

interface FavoriteButtonProps {
  movieId: number;
}

export function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleFavorite() {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ movieId }),
        },
      );

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
    >
      {loading ? "Adicionando..." : "Adicionar aos Favoritos"}
    </button>
  );
}