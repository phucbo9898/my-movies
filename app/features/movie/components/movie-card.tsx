"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/app/types/movie";
import { Play } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  type?: string;
}

export function MovieCard({ movie, type = "" }: MovieCardProps) {
  const normalizeEpisodeName = (name: string): string => {
    const value = name.trim();

    // Only number
    if (/^\d+$/.test(value)) {
      return `${parseInt(value)}`;
    }

    // Episode 1 -> Tập 1
    const episodeMatch = value.match(/^Tập\s+(\d+)$/i);
    if (episodeMatch) {
      return `${episodeMatch[1]}`;
    }

    return value;
  };
  
  return (
    <Link href={`/movie/${movie.slug}`}>
      <div className="group relative overflow-hidden bg-card rounded-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Thumbnail Container */}
        <div className="relative aspect-9/13 w-full overflow-hidden bg-muted">
          <Image
            src={movie.thumb_url || movie.poster_url}
            alt={movie.name}
            fill
            className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-115"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />

          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Enhanced Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

          {/* Quality Badge */}
          {movie.quality && (
            <div className="absolute left-3 top-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              {movie.quality}
            </div>
          )}

          {/* Status/Episode Badge */}
          {movie.episode_current &&
            (type === "search" ? (
              <div className="absolute right-3 top-3 rounded-lg bg-linear-to-r from-green-600 to-green-700 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                PĐ: {movie.last_episodes.map((ep) => normalizeEpisodeName(ep.name))}
              </div>
            ) : (
              <div className="absolute right-3 top-3 rounded-lg bg-linear-to-r from-red-600 to-red-700 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                {movie.episode_current}
              </div>
            )
          )}

          {/* Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="h-7 w-7 fill-current ml-0.5" />
            </div>
          </div>

          {/* Title & Info Overlay */}
          <div className="absolute left-0 right-0 bottom-0 p-3">
            <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-1">
              <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight">
                {movie.name}
              </h3>

              {movie.origin_name && (
                <p className="mt-1 text-xs text-white/70 line-clamp-1">
                  {movie.origin_name}
                </p>
              )}

              {/* Year Badge (if available) */}
              {movie.year && (
                <div className="mt-2 inline-block px-2 py-1 rounded bg-white/20 text-xs text-white/90">
                  {movie.year}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
