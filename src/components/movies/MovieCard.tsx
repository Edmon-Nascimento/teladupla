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
      <div className="cursor-pointer hover:opacity-80 transition-opacity">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <h3 className="mt-4 font-semibold text-lg truncate">{movie.title}</h3>
        {movie.rating && (
          <p className="text-sm text-muted-foreground">
            Rating: {movie.rating.toFixed(1)}/10
          </p>
        )}
      </div>
    </Link>
  );
}