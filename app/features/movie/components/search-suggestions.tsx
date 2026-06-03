"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Trending Searches */}
      {/* <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-white">Trending Now</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TRENDING_SEARCHES.map((search) => (
            <Link
              key={search}
              href={`/search?q=${encodeURIComponent(search)}`}
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10 hover:border-white/20"
            >
              {search}
            </Link>
          ))}
        </div>
      </div> */}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <h3 className="font-semibold">Recent Searches</h3>
            </div>
            <button
              onClick={handleClearRecent}
              className="text-xs hover:text-blue-500 transition"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <Link
                key={search}
                href={`/search?q=${encodeURIComponent(search)}`}
                className="px-3 py-2 rounded-lg border border-blue-300 text-sm transition hover:border-blue-500"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
