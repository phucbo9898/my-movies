import { MovieDetail } from "@/app/types/movie-detail";
import { EpisodeList } from "@/app/features/movie/components/episode-list";
import { MovieDetailHero } from "@/app/features/movie/components/movie-detail-hero";
import { MovieMeta } from "@/app/features/movie/components/movie-meta";

interface MovieDetailWrapperProps {
  moviePromise: Promise<MovieDetail | null>;
}

export default async function MovieDetailWrapper({
  moviePromise,
}: MovieDetailWrapperProps) {
  const movie = await moviePromise;
  if (!movie) return null;

  return (
    <>
      <MovieDetailHero movie={movie} />

      <div className="space-y-8">
        <MovieMeta movie={movie} />
        <EpisodeList episodes={movie.episodes} movieSlug={movie.slug} />
      </div>
    </>
  );
}
