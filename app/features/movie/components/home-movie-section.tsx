"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Movie } from "@/app/types/movie";
import { MovieCard } from "./movie-card";

interface HomeMovieSectionProps {
  title: string;
  movies: Movie[];
  className?: string;
}

const SLIDE_GAP = 16;
const CARD_MIN_WIDTH = 240;

export function HomeMovieSection({
  title,
  movies,
  className = "",
}: HomeMovieSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const slideItems = movies.slice(0, 30);

  const updateButtons = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setCanScrollPrev(container.scrollLeft > 8);
    setCanScrollNext(
      container.scrollLeft + container.clientWidth + 8 < container.scrollWidth,
    );
  }, []);

  useEffect(() => {
    updateButtons();
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener("scroll", updateButtons, { passive: true });
    return () => container.removeEventListener("scroll", updateButtons);
  }, [updateButtons, slideItems.length]);

  const getSlideDistance = () => {
    const container = containerRef.current;
    if (!container) {
      return CARD_MIN_WIDTH + SLIDE_GAP;
    }

    const firstSlide = container.querySelector<HTMLElement>(".slide-item");
    if (!firstSlide) {
      return CARD_MIN_WIDTH + SLIDE_GAP;
    }

    return firstSlide.offsetWidth + SLIDE_GAP;
  };

  const scrollOne = (direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const distance = getSlideDistance();
    container.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

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
        scrollOne("next");
      } else {
        scrollOne("prev");
      }
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-3xl font-bold capitalize text-white">{title}</h2>
        <div className="h-1 w-16 rounded-full bg-linear-to-r from-primary via-primary/70 to-transparent" />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-2 sm:pl-4">
          <button
            type="button"
            onClick={() => scrollOne("prev")}
            disabled={!canScrollPrev}
            className="pointer-events-auto rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous movies"
          >
            <span className="text-xl">‹</span>
          </button>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-2 sm:pr-4">
          <button
            type="button"
            onClick={() => scrollOne("next")}
            disabled={!canScrollNext}
            className="pointer-events-auto rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next movies"
          >
            <span className="text-xl">›</span>
          </button>
        </div>

        <div className="-mx-4 overflow-hidden pb-4 sm:-mx-6 lg:-mx-8">
          <div
            ref={containerRef}
            className="flex gap-4 px-4 sm:px-6 lg:px-8 overflow-x-auto overflow-y-hidden scroll-smooth touch-pan-x hide-scrollbar"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {slideItems.map((movie) => (
              <div
                key={movie._id}
                className="slide-item min-w-55 shrink-0 sm:min-w-60 lg:min-w-65 overflow-hidden"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
