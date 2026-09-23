import { FavoriteButton } from "@/components/movies/FavoriteButton";
import { getMovieDetails } from "@/lib/api/tmdb";
import ReviewsSection from "@/components/movies/ReviewsSection";
import Image from "next/image";

interface MoviePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function MoviePage({
  params,
  searchParams,
}: MoviePageProps) {
  const { id } = await params;
  const { type } = await searchParams;

  const movieId = parseInt(id);
  const mediaType = type === "tv" ? "tv" : "movie";

  const movie = await getMovieDetails(movieId, mediaType);

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "/placeholder.png";

  const backdropUrl = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative min-h-screen overflow-hidden">
        {backdropUrl && (
          <>
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-slate-950/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
          </>
        )}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] lg:gap-14">
            <div className="flex justify-center md:justify-start">
              <Image
                src={posterUrl}
                alt={`Poster de ${movie.title}`}
                width={500}
                height={750}
                className="w-56 rounded-xl shadow-2xl md:w-full"
              />
            </div>

            <div className="max-w-3xl text-center md:text-left">
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-5xl">
                {movie.title}
              </h1>

              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-300 md:justify-start">
                {movie.rating && (
                  <span className="font-semibold text-yellow-400">
                    ★ {movie.rating.toFixed(1)}
                  </span>
                )}

                {movie.releaseDate && (
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString("pt-BR")}
                  </span>
                )}

                {movie.mediaType && (
                  <span>
                    {movie.mediaType === "tv" ? "Série" : "Filme"}
                  </span>
                )}
              </div>

              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <div className="mb-7 flex flex-wrap justify-center gap-2 md:justify-start">
                  {movie.genres.map(
                    (genre: string | { name: string }) => (
                      <span
                        key={
                          typeof genre === "string" ? genre : genre.name
                        }
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-gray-200 backdrop-blur-sm"
                      >
                        {typeof genre === "string" ? genre : genre.name}
                      </span>
                    ),
                  )}
                </div>
              )}

              <div className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">Sinopse</h2>

                <p className="max-w-2xl font-medium leading-7 text-gray-300 text-justify">
                  {movie.overview || "Sem sinopse disponível"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <FavoriteButton movieId={movie.id} />

                
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection movieId={movie.id} />
    </main>
  );
}