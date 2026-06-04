import { Suspense } from "react";
import { SearchPageHeader } from "@/app/features/movie/components/search-page-header";
import { SearchSuggestions } from "@/app/features/movie/components/search-suggestions";
import { SearchResultsClient } from "@/app/features/movie/components/search-results-client";
import MainLayout from "@/app/shared/components/layout/main-layout";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const keyword = params.q || "";
  const page = parseInt(params.page || "1", 10);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Search Header */}
        <SearchPageHeader keyword={keyword} />

        {/* Search Results or Suggestions - Client Side */}
        {!keyword.trim() ? (
          <div className="py-4">
            <SearchSuggestions />
          </div>
        ) : (
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResultsClient initialKeyword={keyword} initialPage={page} />
          </Suspense>
        )}
      </div>
    </MainLayout>
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
          <div
            key={i}
            className="aspect-9/13 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
