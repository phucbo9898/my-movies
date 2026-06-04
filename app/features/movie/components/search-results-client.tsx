"use client";

import { useEffect } from "react";
import { useSearchResults } from "@/app/hooks/use-search-results";
import { SearchResultInfo } from "./search-result-info";
import { MovieGrid } from "./movie-grid";
import { SearchNoResults } from "./search-no-results";
import { ClientPagination } from "./client-pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsClientProps {
  initialKeyword: string;
  initialPage?: number;
}

export function SearchResultsClient({
  initialKeyword,
  initialPage = 1,
}: SearchResultsClientProps) {
  const { data, isLoading, currentPage, goToPage, hasResults, search } =
    useSearchResults(initialKeyword, initialPage);

  // Reset search when initialKeyword changes from server-side navigation
  useEffect(() => {
    search(initialKeyword);
  }, [initialKeyword, search]);

  if (!initialKeyword.trim()) {
    return null;
  }

  if (isLoading && !data) {
    return <SearchResultsSkeleton />;
  }

  if (!data || !hasResults) {
    return <SearchNoResults keyword={initialKeyword} />;
  }

  return (
    <div id="search-results" className="space-y-8 scroll-mt-32">
      <SearchResultInfo
        keyword={initialKeyword}
        totalItems={data.totalItems}
        currentPage={data.currentPage}
        itemsPerPage={data.itemsPerPage}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-9/13 rounded-lg" />
          ))}
        </div>
      ) : (
        <MovieGrid movies={data.movies} className="" type="search" />
      )}

      {/* Pagination Section */}
      {data.totalPages > 1 && (
        <div className="space-y-4 pt-8 border-t border-border dark:border-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page{" "}
              <span className="font-semibold text-foreground">
                {data.currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {data.totalPages}
              </span>
            </p>
            <ClientPagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={goToPage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Info Skeleton */}
      <div className="pb-6 border-b border-border dark:border-white/10">
        <div className="h-8 w-48 bg-muted rounded-lg mb-3" />
        <div className="h-4 w-64 bg-muted rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-9/13 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
