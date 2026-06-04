"use client";

import { Movie } from "@/app/types/movie";
import { MovieCard } from "./movie-card";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieGridProps {
  movies: Movie[];
  className?: string;
  type?: string;
}

export function MovieGrid({ movies, className = "", type = "" }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div
        className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-9/13 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
    >
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} type={type} />
      ))}
    </div>
  );
}
