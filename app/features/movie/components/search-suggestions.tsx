"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Flame, Trash2 } from "lucide-react";

const TRENDING_SEARCHES = [
  "Avengers",
  "Inception",
  "The Dark Knight",
  "Dune",
  "Avatar",
  "Oppenheimer",
];

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("recentSearches");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function SearchSuggestions() {
  const [recentSearches, setRecentSearches] =
    useState<string[]>(getRecentSearches());

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleRemoveRecent = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Trending Searches */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-600/30">
            <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold text-foreground dark:text-white">
            Trending Now
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {TRENDING_SEARCHES.map((search) => (
            <Link
              key={search}
              href={`/search?q=${encodeURIComponent(search)}`}
              className="group px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground transition hover:bg-orange-50 hover:border-orange-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-linear-to-r dark:hover:from-orange-600/30 dark:hover:to-red-600/30 dark:hover:border-orange-400/50"
            >
              <span className="group-hover:text-orange-700 dark:group-hover:text-white transition">
                {search}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/30 to-cyan-600/30">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">Recent Searches</h3>
            </div>
            <button
              onClick={handleClearRecent}
              className="text-xs text-muted-foreground hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <div key={search} className="group relative">
                <Link
                  href={`/search?q=${encodeURIComponent(search)}`}
                  className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-700 transition hover:bg-blue-100 hover:border-blue-300 block group-hover:pr-8 dark:border-blue-400/30 dark:bg-blue-600/10 dark:text-blue-300 dark:hover:bg-blue-600/20 dark:hover:border-blue-400/50"
                >
                  {search}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveRecent(search);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 transition"
                  title={`Remove "${search}"`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M18 6l-12 12M6 6l12 12" />
    </svg>
  );
}
