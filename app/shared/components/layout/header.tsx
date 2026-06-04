"use client";

import { useRef } from "react";
import Link from "next/link";

export function Header() {
  const headerRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="relative mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo - centered on mobile, left-aligned on md+ */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none inline-flex items-center gap-3 text-foreground"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-lg font-black">M</span>
            </div>
            <div className="hidden min-w-0 flex-col overflow-hidden sm:flex">
              <span className="truncate text-base font-semibold text-foreground">
                MyMovies
              </span>
              <span className="truncate text-sm text-muted-foreground">
                Stream with ease
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
            <Link href="/genres" className="transition hover:text-foreground">
              Category
            </Link>
            <Link href="/search" className="transition hover:text-foreground">
              Movie
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
