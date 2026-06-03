"use client";

import { Movie } from "@/app/types/movie";
import { MovieCard } from "./movie-card";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieGridProps {
  movies: Movie[];
  className?: string;
}

export function MovieGrid({ movies, className = "" }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div
        className={`grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}
    >
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
}
