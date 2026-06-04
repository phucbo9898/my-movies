"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchNoResultsProps {
  keyword: string;
  onClearSearch?: () => void;
}

export function SearchNoResults({
  keyword,
  onClearSearch,
}: SearchNoResultsProps) {
  const router = useRouter();

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    }
    router.push("/search");
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-amber-600/20 rounded-full blur-2xl dark:bg-amber-600/20" />
        <div className="relative bg-amber-100 p-6 rounded-full dark:bg-linear-to-br dark:from-amber-600/30 dark:to-orange-600/30">
          <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center dark:text-white">
        No Results Found
      </h2>
      <p className="text-muted-foreground text-center max-w-sm mb-8 dark:text-zinc-400">
        We couldn&apos;t find any movies or series matching{" "}
        <strong>&quot;{keyword}&quot;</strong>
      </p>

      {/* Suggestions */}
      <div className="space-y-4 w-full max-w-sm mb-8">
        <p className="text-sm font-semibold text-foreground text-center dark:text-zinc-300">
          Try these tips:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground dark:text-zinc-400">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-0.5 dark:text-blue-400">•</span>
            <span>Check the spelling and try again</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>Try different or shorter keywords</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>Search by actor or director name</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleClear}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
        >
          Try Another Search
        </button>
        <Link
          href="/genres"
          className="px-6 py-2 rounded-lg bg-accent text-foreground font-medium hover:bg-accent/80 transition text-center dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          Browse by Genre
        </Link>
      </div>
    </div>
  );
}
