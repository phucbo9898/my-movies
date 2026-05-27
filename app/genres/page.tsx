import MainLayout from "@/app/shared/components/layout/main-layout";
import { getGenres } from "@/app/services/movie-ophim-api";
import { GenreGrid } from "@/app/features/genre/components/genre-grid";
import { Footer } from "@/app/shared/components/layout/footer";

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <MainLayout genres={genres}>
      <main className="space-y-8">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-4xl font-bold text-white mb-2">Danh Mục Phim</h1>
          <p className="text-zinc-400">
            Chọn danh mục yêu thích để khám phá những bộ phim hay nhất
          </p>
        </div>

        {/* Genre Grid */}
        <GenreGrid genres={genres} />
      </main>

      {/* Footer */}
      <Footer />
    </MainLayout>
  );
}
