"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  useEffect(() => {
    if (isPaused || total <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 10000);

    return () => clearInterval(id);
  }, []);

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
    return <div className="h-44 rounded-2xl bg-white/5" />;
  }

  return (
    <section className="relative">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl touch-pan-y"
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
            <Link
              href={`/movie/${m.slug}`}
              key={m._id}
              className="relative min-w-full h-72 sm:h-96 lg:h-[420px]"
            >
              <Image
                src={m.poster_url || m.thumb_url}
                alt={m.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                priority={false}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute left-6 bottom-5 right-6 max-w-3xl text-white">
                <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">
                  {m.name}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1 text-sm text-zinc-300">
                  {m.quality && (
                    <p className="mt-2 text-sm text-zinc-300 sm:block border border-white/20 inline-block px-2 py-1 rounded">
                      {m.quality}
                    </p>
                  )}
                  {m.episode_current && (
                    <p className="mt-2 text-sm text-zinc-300 sm:block border border-white/20 inline-block px-2 py-1 rounded">
                      {m.episode_current}
                    </p>
                  )}
                  {m.lang && (
                    <p className="mt-2 text-sm text-zinc-300 sm:block border border-white/20 inline-block px-2 py-1 rounded">
                      {m.lang}
                    </p>
                  )}
                  {m.time && (
                    <p className="mt-2 text-sm text-zinc-300 sm:block border border-white/20 inline-block px-2 py-1 rounded">
                      {m.time}
                    </p>
                  )}
                </div>
              </div>
            </Link>
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
