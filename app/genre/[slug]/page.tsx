import MainLayout from "@/app/shared/components/layout/main-layout";
import { getMoviesByGenre } from "@/app/services/movie-ophim-api";
import GenreMoviesWrapper from "@/app/features/movie/components/genre-movies-wrapper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/app/shared/components/layout/footer";

interface GenreDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GenreDetailPage({
  params,
}: GenreDetailPageProps) {
  const { slug } = await params;
  const moviesPromise = getMoviesByGenre(slug, 1);

  const genreName = "Danh Mục"; // Implement fetching genre name by slug if needed

  return (
    <MainLayout>
      <main className="space-y-8 py-6">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {genreName}
          </h1>
          <p className="text-muted-foreground">Đang tải danh sách phim...</p>
        </div>

        {/* Movie Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 lg:px-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-lg" />
              ))}
            </div>
          }
        >
          <GenreMoviesWrapper moviesPromise={moviesPromise} />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </MainLayout>
  );
}
