import { notFound } from "next/navigation";
import MainLayout from "../../shared/components/layout/main-layout";
import { EpisodeList } from "../../features/movie/components/episode-list";
import { MovieDetailHero } from "../../features/movie/components/movie-detail-hero";
import { getMovieDetail } from "../../services/movie-ophim-api";
import { MovieMeta } from "@/app/features/movie/components/movie-meta";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { slug } = await params;

  const [movie] = await Promise.all([
    getMovieDetail(decodeURIComponent(slug)),
  ]);

  if (!movie) {
    notFound();
  }

  return (
    <MainLayout>
      <main className="space-y-8 pb-12 pt-6">
        <MovieDetailHero movie={movie} />

        <div className="space-y-8">
          <MovieMeta movie={movie} />
          <EpisodeList episodes={movie.episodes} movieSlug={movie.slug} />
        </div>
      </main>
    </MainLayout>
  );
}
