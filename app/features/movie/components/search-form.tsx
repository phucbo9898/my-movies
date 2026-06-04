"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader } from "lucide-react";

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
      <div className="space-y-3">
        <div className="relative group">
          {/* Input Container with gradient border effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-2xl blur opacity-0 group-focus-within:opacity-75 transition duration-300 dark:from-blue-600/50 dark:via-purple-600/50 dark:to-blue-600/50" />

          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              {isLoading ? (
                <Loader className="h-5 w-5 text-primary animate-spin dark:text-blue-400" />
              ) : (
                <Search className="h-5 w-5 text-primary dark:text-blue-400" />
              )}
            </div>

            <input
              type="text"
              placeholder="Search movies, series, actors..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
              className="relative w-full rounded-2xl border border-input bg-background text-foreground placeholder-muted-foreground transition focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-border py-4 pl-12 pr-12 dark:border-white/20 dark:bg-white/8 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:bg-white/10 dark:hover:border-white/30"
            />

            {keyword && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition dark:text-zinc-400 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !keyword.trim()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 dark:bg-linear-to-r dark:from-blue-600 dark:to-blue-700 dark:text-white dark:hover:from-blue-700 dark:hover:to-blue-800 dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
