"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie } from "@/app/types/movie";

interface BannerProps {
  movies: Movie[];
}

export default function Banner({ movies }: BannerProps) {
  const total = movies?.length ?? 0;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const go = useCallback(
    (to: number) => {
      if (total === 0) return;
      const next = (to + total) % total;
      setIndex(next);
    },
    [total],
  );

  // update effect to depend on pause/total
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 10000);

    return () => clearInterval(id);
  }, [isPaused, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        go(index + 1);
      } else {
        go(index - 1);
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  if (!movies || movies.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8">
        <Skeleton className="w-full h-44 sm:h-56 rounded-2xl" />
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {movies.map((m) => (
            <div
              key={m._id}
              role="link"
              tabIndex={0}
              onClick={() => (window.location.href = `/movie/${m.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  window.location.href = `/movie/${m.slug}`;
              }}
              className="relative min-w-full h-72 sm:h-96 lg:h-[420px] cursor-pointer"
            >
              <Image
                src={m.poster_url || m.thumb_url}
                alt={m.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                priority={false}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute left-4 bottom-4 right-4 max-w-3xl text-white md:left-8 md:bottom-8 md:right-8">
                <h3 className="text-2xl font-extrabold sm:text-3xl md:text-4xl leading-tight">
                  {m.name}
                </h3>

                <div className="flex flex-wrap gap-2 mt-3 text-sm">
                  {m.quality && (
                    <span className="inline-block text-sm bg-popover/10 border border-border px-2 py-1 rounded text-white">
                      {m.quality}
                    </span>
                  )}
                  {m.episode_current && (
                    <span className="inline-block text-sm text-white bg-popover/10 border border-border px-2 py-1 rounded">
                      {m.episode_current}
                    </span>
                  )}
                  {m.lang && (
                    <span className="inline-block text-sm text-white bg-popover/10 border border-border px-2 py-1 rounded">
                      {m.lang}
                    </span>
                  )}
                  {m.time && (
                    <span className="inline-block text-sm text-white bg-popover/10 border border-border px-2 py-1 rounded">
                      {m.time}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/watch/${m.slug}`;
                    }}
                  >
                    Watch
                  </Button>

                  <Button
                    variant="warning"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/movie/${m.slug}`;
                    }}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left / Right controls */}
        {total > 1 && (
          <>
            <button
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute right-1 bottom-2 z-20 flex -translate-x-1/2 gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                i === index ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
