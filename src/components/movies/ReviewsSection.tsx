"use client";

import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  movieId: number;
  user: {
    id: string;
    name: string;
  };
}

interface ReviewsSectionProps {
  movieId: number;
}

export default function ReviewsSection({
  movieId,
}: ReviewsSectionProps) {
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] =
    useState<Review | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSuccess() {
    setShowForm(false);
    setEditingReview(null);
    setRefreshKey((current) => current + 1);
  }

  function handleEdit(review: Review) {
    setEditingReview(review);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingReview(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">
          Reviews
        </h2>

        {user && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="cursor-pointer rounded-lg bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Adicionar Review
          </button>
        )}
      </div>

      {showForm && user && (
        <div className="mb-8">
          <ReviewForm
            movieId={movieId}
            reviewId={editingReview?.id}
            initialContent={editingReview?.content}
            initialRating={editingReview?.rating}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ReviewList
        movieId={movieId}
        refreshKey={refreshKey}
        currentUserId={user?.id}
        onEdit={handleEdit}
      />
    </section>
  );
}