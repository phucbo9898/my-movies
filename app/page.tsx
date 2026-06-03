import {
  getGenres,
  getListingMovies,
  getMoviesByGenre,
} from "./services/movie-ophim-api";
import MainLayout from "./shared/components/layout/main-layout";
import BannerWrapper from "./features/movie/components/banner-wrapper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MovieSectionWrapper from "./features/movie/components/movie-section-wrapper";

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
  const bannerPromise = getListingMovies(listingSlug, 1, 5);

  const categoryPromises = HOME_CATEGORIES.map((category) => ({
    title: category.title,
    moviesPromise: getCategoryMovies(category.slug, category.source),
  }));

  // We'll optimistically assume there will be movies; each section streams independently.
  const hasMovies = true;

  return (
    <MainLayout
      banner={
        <Suspense
          fallback={
            <div className="px-4 sm:px-6 lg:px-8">
              <Skeleton className="w-full h-44 sm:h-56 rounded-2xl" />
            </div>
          }
        >
          <BannerWrapper moviesPromise={bannerPromise} />
        </Suspense>
      }
    >
      <main className="space-y-12 py-6">
        {hasMovies ? (
          <div className="space-y-12 pb-24">
            {categoryPromises.map((group) => (
              <Suspense
                key={group.title}
                fallback={
                  <div className="px-4 sm:px-6 lg:px-8">
                    <Skeleton className="w-full h-36 rounded-xl mb-4" />
                  </div>
                }
              >
                <MovieSectionWrapper
                  title={group.title}
                  moviesPromise={group.moviesPromise}
                />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-muted/30 p-8 text-center text-muted-foreground py-12">
            No movies found. Check the API configuration or try again later.
          </div>
        )}
      </main>
    </MainLayout>
  );
}
