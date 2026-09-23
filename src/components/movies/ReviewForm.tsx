"use client";

import { FormEvent, useState } from "react";

interface ReviewFormProps {
  movieId: number;
  reviewId?: string;
  initialContent?: string;
  initialRating?: number;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  movieId,
  reviewId,
  initialContent = "",
  initialRating = 5,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const isEditing = Boolean(reviewId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!content.trim()) {
      setError("Escreva um comentário.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        isEditing
          ? `${apiUrl}/api/reviews/${reviewId}`
          : `${apiUrl}/api/reviews`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            movieId,
            content: content.trim(),
            rating,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Não foi possível salvar a review.");
        return;
      }

      if (!isEditing) {
        setContent("");
        setRating(5);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="mb-5 text-xl font-semibold">
        {isEditing ? "Editar review" : "Adicionar review"}
      </h3>

      <div className="mb-5">
        <label
          htmlFor="review-rating"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Nota
        </label>

        <select
          id="review-rating"
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400"
        >
          <option value={5}>5 - Excelente</option>
          <option value={4}>4 - Muito bom</option>
          <option value={3}>3 - Regular</option>
          <option value={2}>2 - Ruim</option>
          <option value={1}>1 - Péssimo</option>
        </select>
      </div>

      <div className="mb-5">
        <label
          htmlFor="review-content"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Comentário
        </label>

        <textarea
          id="review-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="O que você achou deste filme?"
          rows={5}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-lg bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Publicar review"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer rounded-lg bg-white/10 px-5 py-2.5 font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}