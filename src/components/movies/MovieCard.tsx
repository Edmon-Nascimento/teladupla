import type { Movie } from "@/types";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
    : "/placeholder.png";

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-2">
          <img
            src={imageUrl}
            alt={`Poster de ${movie.title}`}
            className="w-full h-auto group-hover:opacity-80 transition-opacity"
            loading="lazy"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-400">
            {movie.title}
          </h3>
          {movie.rating && (
            <p className="text-xs text-gray-400">
              {movie.rating.toFixed(1)}/10
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}