import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/app/types/movie";
import { searchMovies } from "@/app/services/movie-ophim-api";

export interface SearchResultsData {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function useSearchResults(
  initialKeyword: string,
  initialPage: number = 1,
) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [data, setData] = useState<SearchResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(
    async (searchKeyword: string, page: number) => {
      if (!searchKeyword.trim()) {
        setData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchMovies(searchKeyword, page);
        if (results) {
          setData(results);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Initial fetch
  useEffect(() => {
    fetchResults(keyword, currentPage);
  }, [keyword, currentPage, fetchResults]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    const resultsElement = document.getElementById("search-results");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const search = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setCurrentPage(1);
  }, []);

  return {
    keyword,
    currentPage,
    data,
    isLoading,
    error,
    goToPage,
    search,
    hasResults: data && data.movies.length > 0,
  };
}
