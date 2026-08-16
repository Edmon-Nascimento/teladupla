import { getTrendingMovies } from "@/lib/api/tmdb";
import MovieCard from "@/components/movies/MovieCard";

export default async function Home() {
  const movies = await getTrendingMovies();

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Filmes em Tendência</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </main>
  );
}