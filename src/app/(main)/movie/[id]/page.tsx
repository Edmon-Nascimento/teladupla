import { getMovieDetails } from "@/lib/api/tmdb";
import { FavoriteButton } from "@/components/movies/FavoriteButton";
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
      <section className="relative min-h-[700px] overflow-hidden">
        {backdropUrl && (
          <>
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </>
        )}

        <div className="relative z-10 mx-auto flex min-h-[700px] max-w-7xl items-end px-6 py-12 lg:px-8">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Image
                src={posterUrl}
                alt={`Poster de ${movie.title}`}
                width={500}
                height={750}
                className="w-full max-w-sm rounded-lg shadow-2xl"
              />
            </div>

            <div className="md:col-span-2">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                {movie.title}
              </h1>

              {movie.rating && (
                <div className="mb-6">
                  <p className="text-2xl font-semibold text-yellow-400">
                    {movie.rating.toFixed(1)}/10
                  </p>
                </div>
              )}

              {movie.releaseDate && (
                <p className="mb-4 text-gray-300">
                  Lançamento:{" "}
                  {new Date(movie.releaseDate).toLocaleDateString("pt-BR")}
                </p>
              )}

              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-semibold">Gêneros:</p>

                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: string | { name: string }) => (
                      <span
                        key={typeof genre === "string" ? genre : genre.name}
                        className="rounded-full bg-gray-700/80 px-3 py-1 text-sm"
                      >
                        {typeof genre === "string" ? genre : genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Sinopse</h2>

                <p className="leading-relaxed text-gray-300">
                  {movie.overview || "Sem sinopse disponível"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <FavoriteButton movieId={movie.id} />

                <button className="cursor-pointer rounded-lg bg-gray-700 px-6 py-3 font-semibold transition hover:bg-gray-600">
                  Adicionar Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold">Reviews</h2>

        <div className="space-y-4">
          <p className="text-gray-400">Nenhum review ainda</p>
        </div>
      </section>
    </main>
  );
}