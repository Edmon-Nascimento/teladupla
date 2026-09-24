"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  tmdbId: number;
}

export function FavoriteButton({ tmdbId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function checkFavorite() {
      try {
        const response = await fetch(`${apiUrl}/api/favorites`, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          const favoriteExists = data.data.some(
            (favorite: { tmdbId: number }) => favorite.tmdbId === tmdbId,
          );

          setIsFavorite(favoriteExists);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    checkFavorite();
  }, [tmdbId, apiUrl]);

  async function handleFavorite() {
    setLoading(true);

    try {
      if (isFavorite) {
        const response = await fetch(`${apiUrl}/api/favorites/${tmdbId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setIsFavorite(false);
        }

        return;
      }

      const response = await fetch(`${apiUrl}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ tmdbId }),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleFavorite} disabled={loading}>
      {loading
        ? "Carregando..."
        : isFavorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"}
    </Button>
  );
}
