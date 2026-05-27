import {
  getGenres,
  getHomeMovies,
  getListingMovies,
} from "./services/movie-ophim-api";
import MainLayout from "./shared/components/layout/main-layout";
import Banner from "./features/movie/components/banner";
import { HomeMovieSection } from "./features/movie/components/home-movie-section";
import { Footer } from "./shared/components/layout/footer";

export default async function Home() {
  const [movieGroups, genres] = await Promise.all([
    getHomeMovies(),
    getGenres(),
  ]);
  const listingSlug = genres && genres.length > 0 ? genres[0].slug : "phim-le";
  const bannerMovies = await getListingMovies(listingSlug, 1, 5);
  const entries = Object.entries(movieGroups);
  const hasMovies = entries.some(([, movies]) => movies.length > 0);

  return (
    <MainLayout genres={genres}>
      <main className="space-y-12">
        {/* Banner */}
        <Banner movies={bannerMovies} />

        {/* Movie Collections */}
        {hasMovies ? (
          <div className="space-y-12 pb-20">
            {entries.map(([groupKey, movies]) =>
              movies.length > 0 ? (
                <HomeMovieSection
                  key={groupKey}
                  title={groupKey}
                  movies={movies}
                />
              ) : null,
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
