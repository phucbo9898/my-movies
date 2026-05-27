import { Movie } from "@/app/types/movie";
import { MovieGrid } from "./movie-grid";

interface HomeMovieSectionProps {
  title: string;
  movies: Movie[];
  className?: string;
}

export function HomeMovieSection({
  title,
  movies,
  className = "",
}: HomeMovieSectionProps) {
  return (
    <section className={`space-y-5 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-3xl font-bold capitalize text-white">{title}</h2>
        <div className="h-1 w-16 rounded-full bg-linear-to-r from-primary via-primary/70 to-transparent" />
      </div>

      <MovieGrid movies={movies.slice(0, 10)} className="pt-2" />
    </section>
  );
}
