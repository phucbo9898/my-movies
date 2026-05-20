"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Category } from "@/app/types/movie";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  genres: Category[];
}

export default function MainLayout({ children, genres }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_25%),linear-gradient(180deg,#030712_0%,#090b11_45%,#05070d_100%)] text-white">
      <Header
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
        onToggleSearch={() => setSearchOpen((value) => !value)}
      />

      <div className="relative flex min-h-[calc(100vh-5rem)]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          genres={genres}
        />

        <div className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {searchOpen && (
              <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
                      Quick search
                    </p>
                    <h1 className="text-2xl font-semibold text-white">
                      Search movies, series, and casts
                    </h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                      Type the title or keyword to discover new films and build
                      your next watchlist.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Close
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label htmlFor="movie-search" className="sr-only">
                    Search movies
                  </label>
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      id="movie-search"
                      type="search"
                      placeholder="Search for a movie, actor, or genre"
                      className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-14 items-center justify-center rounded-3xl bg-primary px-5 text-sm font-semibold text-zinc-950 transition hover:bg-primary/90"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close mobile sidebar"
        />
      )}
    </div>
  );
}
