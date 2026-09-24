"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewUser {
  id: string;
  name: string;
}

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  movieId: number;
  user: ReviewUser;
}

interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

interface ReviewListProps {
  movieId: number;
  refreshKey: number;
  currentUserId?: string;
  onEdit: (review: Review) => void;
}

export default function ReviewList({
  movieId,
  refreshKey,
  currentUserId,
  onEdit,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiUrl}/api/reviews/movie/${movieId}`);

        if (!response.ok) {
          throw new Error("Não foi possível carregar as reviews.");
        }

        const data: ReviewsResponse = await response.json();

        if (!data.success) {
          throw new Error("Não foi possível carregar as reviews.");
        }

        setReviews(data.data);
      } catch (error) {
        console.error(error);
        setError("Não foi possível carregar as reviews.");
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [movieId, refreshKey, apiUrl]);

  async function handleDelete(reviewId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta review?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.error || "Não foi possível excluir a review.");
      }

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId),
      );
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a review.",
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-gray-400">Carregando reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-gray-400">Nenhuma review ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = currentUserId === review.userId;

        return (
          <article
            key={review.id}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{review.user.name}</p>

                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <span className="font-semibold text-yellow-400">
                ★ {review.rating}/5
              </span>
            </div>

            <p className="leading-7 text-gray-300">{review.content}</p>

            {isOwner && (
              <div className="mt-5 flex gap-3">
                <Button
                  type="button"
                  onClick={() => onEdit(review)}
                  variant="ghost"
                >
                  Editar
                </Button>

                <Button
                  type="button"
                  onClick={() => handleDelete(review.id)}
                  variant="ghost"
                >
                  Excluir
                </Button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
