"use client";

import { SearchForm } from "./search-form";

interface SearchPageHeaderProps {
  keyword?: string;
}

export function SearchPageHeader({ keyword }: SearchPageHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-linear-to-br from-accent/5 via-primary/5 to-transparent backdrop-blur-md p-6 sm:p-8 lg:p-12 dark:border-white/10 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-transparent">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 bg-primary/20 rounded-full blur-3xl pointer-events-none dark:bg-blue-600/10" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none dark:bg-purple-600/10" />

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold dark:text-blue-400">
            ✨ Search & Discover
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Find Your Next Favorite
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary dark:from-blue-400 dark:to-purple-400">
              Movie or Series
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed dark:text-zinc-400">
            Search through thousands of titles. Explore by movie name, actor, or
            keyword.
          </p>
        </div>

        {/* Search Form */}
        <div className="pt-2">
          <SearchForm />
        </div>
      </div>
    </div>
  );
}
