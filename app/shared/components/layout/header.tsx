"use client";

import { Menu, Search } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
}

export function Header({ onToggleSidebar, onToggleSearch }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-100 transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a href="#" className="inline-flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-zinc-950 shadow-lg shadow-primary/20">
              <span className="text-lg font-black">M</span>
            </div>
            <div className="hidden min-w-0 flex-col overflow-hidden sm:flex">
              <span className="truncate text-base font-semibold">MyMovies</span>
              <span className="truncate text-sm text-zinc-400">Stream with ease</span>
            </div>
          </a>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <a href="#" className="transition hover:text-white">Home</a>
          <a href="#" className="transition hover:text-white">Movies</a>
          <a href="#" className="transition hover:text-white">Series</a>
          <a href="#" className="transition hover:text-white">Live</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSearch}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Search className="mr-2 h-4 w-4 text-zinc-100" />
            Search
          </button>

          <a
            href="#"
            className="hidden rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex"
          >
            Browse
          </a>
        </div>
      </div>
    </header>
  );
}
