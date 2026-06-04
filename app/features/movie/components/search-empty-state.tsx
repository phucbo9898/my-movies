"use client";

import { SearchIcon } from "lucide-react";

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl dark:bg-blue-600/20" />
        <div className="relative bg-primary/10 p-6 rounded-full dark:bg-linear-to-br dark:from-blue-600/30 dark:to-purple-600/30">
          <SearchIcon className="h-12 w-12 text-primary dark:text-blue-400" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
        Start Your Search
      </h2>
      <p className="text-muted-foreground text-center max-w-sm dark:text-zinc-400">
        Enter a movie title, actor name, or keyword above to discover amazing
        content
      </p>

      {/* Suggestions Grid */}
      <div className="mt-8 w-full">
        <p className="text-sm font-semibold text-muted-foreground mb-4 text-center dark:text-zinc-300">
          Popular Search Ideas
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          {["Action", "Drama", "Thriller", "Comedy", "Sci-Fi", "Animation"].map(
            (tag) => (
              <div
                key={tag}
                className="px-4 py-2 rounded-xl bg-accent border border-border text-sm text-foreground text-center hover:border-primary hover:bg-accent/80 transition cursor-default dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/10"
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
