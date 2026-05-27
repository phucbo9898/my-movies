"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/app/types/movie";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`}>
      <div className="group relative overflow-hidden rounded-lg bg-linear-to-b from-gray-900/80 to-gray-900/60 shadow-xl transition-transform duration-300 hover:scale-105">
        {/* Thumbnail Container */}
        <div className="relative h-72 w-full overflow-hidden bg-gray-800 dark:bg-gray-800">
          <Image
            src={movie.thumb_url || movie.poster_url}
            alt={movie.name}
            fill
            className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Cinematic Gradient (always subtle, stronger on hover) */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-300" />

          {/* Decorative bottom fade to make titles pop */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/90 to-transparent pointer-events-none" />

          {/* Status Badge */}
          {movie.status && (
            <div className="absolute right-3 top-3 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              {movie.status}
            </div>
          )}

          {/* Quality Badge */}
          {movie.quality && (
            <div className="absolute left-1 top-1 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
              {movie.quality}
            </div>
          )}

          {/* Play Icon on Hover with subtle scale and backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>

          {/* Bottom info: title + meta overlayed on poster */}
          <div className="absolute left-0 right-0 bottom-0 p-3">
            <div className="transform translate-y-4 opacity-80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="line-clamp-2 text-sm font-semibold text-white drop-shadow-md">
                {movie.name}
              </h3>

              <div className="mt-1 mb-2 flex items-center justify-between text-xs text-gray-300">
                <span>{movie.episode_current}</span>
                {movie.year && <span>{movie.year}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
