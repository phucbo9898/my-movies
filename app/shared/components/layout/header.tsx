"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

export function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY || window.pageYOffset;
      const headerHeight = headerRef.current?.offsetHeight ?? 80;
      setShowBottomNav(scrolled > headerHeight + 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-zinc-950 shadow-lg shadow-primary/20">
              <span className="text-lg font-black">M</span>
            </div>
            <div className="hidden min-w-0 flex-col overflow-hidden sm:flex">
              <span className="truncate text-base font-semibold">MyMovies</span>
              <span className="truncate text-sm text-zinc-400">
                Stream with ease
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-300 md:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/genres" className="transition hover:text-white">
              Thể loại
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </nav>
        </div>
      </header>

      <nav
        aria-hidden={!showBottomNav}
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-zinc-950/95 p-2 backdrop-blur-xl md:hidden transition-transform duration-200 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/genres"
            className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
          >
            Thể loại
          </Link>
          <Link
            href="/search"
            className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
          >
            Search
          </Link>
        </div>
      </nav>
    </>
  );
}
