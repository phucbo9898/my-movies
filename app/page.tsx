import { getGenres, getHomeMovies } from "./services/movie-api";
import MainLayout from "./shared/components/layout/main-layout";
import { MovieGrid } from "./features/movie/components/movie-grid";
import { Footer } from "./shared/components/layout/footer";

export default async function Home() {
  const [movieGroups, genres] = await Promise.all([getHomeMovies(), getGenres()]);
  const entries = Object.entries(movieGroups);
  const hasMovies = entries.some(([, movies]) => movies.length > 0);

  return (
    <MainLayout genres={genres}>
      <main className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-4 pt-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Premium Streaming
            </p>
            <h1 className="text-5xl font-bold text-white md:text-6xl">
              Discover Your Next Favorite
            </h1>
            <p className="max-w-2xl text-lg text-zinc-300">
              Explore thousands of movies and series in one place. Stream high-quality entertainment anytime, anywhere.
            </p>
          </div>
        </section>

        {/* Movie Collections */}
        {hasMovies ? (
          <div className="space-y-12 pb-20">
            {entries.map(([groupKey, movies]) =>
              movies.length > 0 ? (
                <section key={groupKey} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold capitalize text-white">
                      {groupKey.replace(/[-_]/g, " ")}
                    </h2>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
                  </div>
                  <MovieGrid movies={movies.slice(0, 10)} className="pt-2" />
                </section>
              ) : null
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-14 text-center text-zinc-300 py-20">
            No movies found. Check the API configuration or try again later.
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </MainLayout>
  );
}
