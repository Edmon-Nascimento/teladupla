import { getMovieDetails } from "@/lib/api/tmdb";
import Image from "next/image";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function MoviePage({ params, searchParams }: MoviePageProps) {
  const { id } = await params;
  const { type } = await searchParams;
  const movieId = parseInt(id);
  const mediaType = type === "tv" ? "tv" : "movie";
  const movie = await getMovieDetails(movieId, mediaType);

  const imageUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
    : "/placeholder.png";

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Image
              src={imageUrl}
              alt={`Poster de ${movie.title}`}
              width={300}
              height={450}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

            {movie.rating && (
              <div className="mb-6">
                <p className="text-2xl font-semibold text-yellow-400">
                  {movie.rating.toFixed(1)}/10
                </p>
              </div>
            )}

            {movie.releaseDate && (
              <p className="text-gray-400 mb-4">
                Lançamento: {new Date(movie.releaseDate).toLocaleDateString("pt-BR")}
              </p>
            )}

            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Gêneros:</p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: string | { name: string }) => (
                    <span
                      key={typeof genre === "string" ? genre : genre.name}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {typeof genre === "string" ? genre : genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || "Sem sinopse disponível"}
              </p>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
                Adicionar aos Favoritos
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition">
                Adicionar Review
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <h2 className="text-3xl font-bold mb-6">Reviews</h2>
          <div className="space-y-4">
            <p className="text-gray-400">Nenhum review ainda</p>
          </div>
        </div>
      </div>
    </main>
  );
}