import type { Movie } from "./types/movie";
import { getGenres, getHomeMovies } from "./services/movie-api";
import MainLayout from "./shared/components/layout/main-layout";

export default async function Home() {
  const [movieGroups, genres] = await Promise.all([
    getHomeMovies(),
    getGenres(),
  ]);
  const entries = Object.entries(movieGroups);
  const hasMovies = entries.some(([, movies]) => movies.length > 0);

  return (
    <MainLayout genres={genres}>
      <main className="min-h-screen">
        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
              Movie streaming example
            </p>
            <h1 className="text-4xl font-semibold text-white">
              Browse home movies
            </h1>
            <p className="max-w-2xl text-zinc-300">
              A minimal server-rendered homepage that fetches movies using the
              service layer.
            </p>
          </header>

          {hasMovies ? (
            <div className="space-y-10">
              {entries.map(([groupKey, movies]) =>
                movies.length > 0 ? (
                  <section key={groupKey}>
                    <h2 className="mb-4 text-2xl font-semibold capitalize text-white">
                      {groupKey.replace(/[-_]/g, " ")}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {movies.slice(0, 6).map((movie: Movie) => (
                        <article
                          key={movie._id}
                          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="mb-4 h-44 w-full rounded-2xl object-cover"
                            src={movie.thumb_url || movie.poster_url}
                            alt={movie.name}
                          />
                          <div className="space-y-2">
                            <p className="text-sm text-zinc-400">
                              {movie.origin_name || movie.type}
                            </p>
                            <h3 className="text-lg font-semibold text-white">
                              {movie.name}
                            </h3>
                            <p className="line-clamp-3 text-sm text-zinc-300">
                              {movie.content}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null,
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-14 text-center text-zinc-300">
              No movies found. Check the API configuration or try again later.
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
