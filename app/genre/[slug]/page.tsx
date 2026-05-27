import MainLayout from "@/app/shared/components/layout/main-layout";
import { getGenres, getMoviesByGenre } from "@/app/services/movie-ophim-api";
import { MovieGrid } from "@/app/features/movie/components/movie-grid";
import { Footer } from "@/app/shared/components/layout/footer";

interface GenreDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GenreDetailPage({
  params,
}: GenreDetailPageProps) {
  const { slug } = await params;
  const [genres, movies] = await Promise.all([
    getGenres(),
    getMoviesByGenre(slug, 1),
  ]);

  const genre = genres.find((g) => g.slug === slug);
  const genreName = genre?.name || "Danh Mục";

  return (
    <MainLayout genres={genres}>
      <main className="space-y-8">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-4xl font-bold text-white mb-2">{genreName}</h1>
          <p className="text-zinc-400">
            {movies.length} bộ phim trong danh mục này
          </p>
        </div>

        {/* Movie Grid */}
        {movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-14 text-center text-zinc-300">
            Không tìm thấy phim nào trong danh mục này
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </MainLayout>
  );
}
