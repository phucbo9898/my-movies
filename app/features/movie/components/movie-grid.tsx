"use client";

import { Movie } from "@/app/types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  className?: string;
}

export function MovieGrid({ movies, className = "" }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 ${className}`}
    >
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
}
