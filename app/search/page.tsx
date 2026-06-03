import { Suspense } from "react";
import { Container } from "@/app/shared/components/layout/container";
import { SearchForm } from "@/app/features/movie/components/search-form";
import { SearchSuggestions } from "@/app/features/movie/components/search-suggestions";
import { MovieGrid } from "@/app/features/movie/components/movie-grid";
import { searchMovies } from "@/app/services/movie-ophim-api";
import { Footer } from "@/app/shared/components/layout/footer";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function SearchResults({
  keyword,
  page,
}: {
  keyword: string;
  page: number;
}) {
  if (!keyword.trim()) {
    return (
      <div className="space-y-8 py-8">
        <SearchSuggestions />
      </div>
    );
  }

  const searchResults = await searchMovies(keyword, page);

  if (!searchResults || searchResults.movies.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">
          No results found
        </h2>
        <p className="text-zinc-400">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Search Results
        </h2>
        <p className="text-zinc-400">
          Found {searchResults.totalItems} movies for &quot;{keyword}&quot;
        </p>
      </div>

      <MovieGrid movies={searchResults.movies} />

      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Page {searchResults.currentPage} of {searchResults.totalPages}
          </p>
          <Pagination
            currentPage={searchResults.currentPage}
            totalPages={searchResults.totalPages}
            getPageHref={(pageNumber) =>
              `/search?q=${encodeURIComponent(keyword)}&page=${pageNumber}`
            }
          />
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-muted/40 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-muted/30 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-lg bg-muted/20" />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const keyword = params.q || "";
  const page = parseInt(params.page || "1", 10);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Container className="flex-1 pb-24">
        {/* Search Header */}
        <div className="mb-8 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Search
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Find Your Next Favorite
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Search through thousands of movies and series. Explore by title,
              actor, or keyword.
            </p>
          </div>

          {/* Search Form */}
          <div className="pt-4">
            <SearchForm />
          </div>
        </div>

        {/* Search Results */}
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults keyword={keyword} page={page} />
        </Suspense>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}
