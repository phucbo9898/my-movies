import { Suspense } from "react";
import { Container } from "@/app/shared/components/layout/container";
import { SearchForm } from "@/app/features/movie/components/search-form";
import { SearchSuggestions } from "@/app/features/movie/components/search-suggestions";
import { MovieGrid } from "@/app/features/movie/components/movie-grid";
import { searchMovies } from "@/app/services/movie-ophim-api";
import { Footer } from "@/app/shared/components/layout/footer";
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

  const movies = await searchMovies(keyword, page);

  if (!movies || movies.length === 0) {
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
          Found {movies.length} movies for &quot;{keyword}&quot;
        </p>
      </div>

      <MovieGrid movies={movies} />

      {/* Pagination info */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <p className="text-sm text-zinc-400">Page {page}</p>
        {movies.length >= 10 && (
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/search?q=${encodeURIComponent(keyword)}&page=${page - 1}`}
                className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
              >
                ← Previous
              </a>
            )}
            <a
              href={`/search?q=${encodeURIComponent(keyword)}&page=${page + 1}`}
              className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
            >
              Next →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-zinc-800 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-zinc-800 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-lg" />
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
    <div className="flex flex-col min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_25%),linear-gradient(180deg,#030712_0%,#090b11_45%,#05070d_100%)] text-white dark:bg-zinc-950">
      <Container className="flex-1 pb-20">
        {/* Search Header */}
        <div className="mb-12 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
              Search
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Find Your Next Favorite
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl">
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
