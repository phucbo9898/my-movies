"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // Save to recent searches
    const stored = localStorage.getItem("recentSearches");
    const recent = stored ? JSON.parse(stored) : [];
    const updated = [
      keyword,
      ...recent.filter((s: string) => s !== keyword),
    ].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    setIsLoading(true);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
    setIsLoading(false);
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>

        <input
          type="text"
          placeholder="Search movies, series, casts..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white/5 py-3 pl-12 pr-12 placeholder-zinc-500 transition focus:border-blue-500 focus:bg-white/10 focus:outline-none dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:focus:bg-zinc-900/60 dark:focus:border-zinc-600/40"
        />

        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 hover:text-blue-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="flex-1 sm:flex-none px-6 py-2 bg-primary text-white rounded-2xl font-medium transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
