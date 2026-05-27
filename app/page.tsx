import {
  getGenres,
  getListingMovies,
  getMoviesByGenre,
} from "./services/movie-ophim-api";
import MainLayout from "./shared/components/layout/main-layout";
import { HomeMovieSection } from "./features/movie/components/home-movie-section";
import { Footer } from "./shared/components/layout/footer";

const HOME_CATEGORIES = [
  { title: "Phim hoạt hình", slug: "hoat-hinh", source: "listing" as const },
  { title: "Phim hành động", slug: "hanh-dong", source: "genre" as const },
  { title: "Phim kinh dị", slug: "kinh-di", source: "genre" as const },
  {
    title: "Top 30 phim lẻ hôm nay",
    slug: "phim-le",
    source: "listing" as const,
  },
  {
    title: "Top 30 phim bộ hôm nay",
    slug: "phim-bo",
    source: "listing" as const,
  },
  {
    title: "Phim chiếu rạp mới",
    slug: "phim-chieu-rap",
    source: "listing" as const,
  },
];

const getCategoryMovies = async (slug: string, source: "genre" | "listing") => {
  if (source === "genre") {
    return getMoviesByGenre(slug, 1);
  }

  return getListingMovies(slug, 1, 30);
};

export default async function Home() {
  const genres = await getGenres();
  const listingSlug = genres.length > 0 ? genres[0].slug : "phim-le";
  const bannerMovies = await getListingMovies(listingSlug, 1, 5);

  const categoryMovieGroups = await Promise.all(
    HOME_CATEGORIES.map(async (category) => ({
      title: category.title,
      movies: await getCategoryMovies(category.slug, category.source),
    })),
  );

  const hasMovies = categoryMovieGroups.some(
    (group) => group.movies.length > 0,
  );

  return (
    <MainLayout bannerMovies={bannerMovies}>
      <main className="space-y-12">
        {hasMovies ? (
          <div className="space-y-12 pb-20">
            {categoryMovieGroups.map((group) =>
              group.movies.length > 0 ? (
                <HomeMovieSection
                  key={group.title}
                  title={group.title}
                  movies={group.movies}
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
    </MainLayout>
  );
}
