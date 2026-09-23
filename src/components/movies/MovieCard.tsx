import type { Movie } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
    : "/placeholder.png";

  return (
  <Link
    href={`/movie/${movie.tmdbId}${movie.mediaType === "tv" ? "?type=tv" : ""}`}
    className="group block"
  >
    <article>
      <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-slate-900">
        <Image
          src={imageUrl}
          alt={`Poster de ${movie.title}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

    </article>
  </Link>
);
}