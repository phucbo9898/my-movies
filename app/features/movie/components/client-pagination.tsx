"use client";

import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/lib/pagination";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: ClientPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageRange = getPaginationRange(currentPage, totalPages);

  const buttonClass = cn(
    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg",
    "border border-input bg-background text-foreground",
    "transition-colors duration-200",
    "hover:bg-accent hover:text-accent-foreground",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "dark:border-white/20 dark:bg-zinc-900 dark:hover:bg-zinc-800",
  );

  const activeClass =
    "bg-primary text-primary-foreground border-primary dark:bg-blue-600 dark:border-blue-600";
  const disabledClass = "pointer-events-none opacity-50";

  return (
    <div className="flex min-w-0 flex-row items-center justify-between gap-2 overflow-x-auto py-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={cn(buttonClass, currentPage === 1 && disabledClass)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex min-w-0 flex-nowrap items-center justify-center gap-1 sm:gap-2">
        {pageRange.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 items-center justify-center rounded-lg px-2 sm:px-3 text-sm text-muted-foreground dark:text-zinc-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              disabled={isLoading}
              className={cn(
                buttonClass,
                item === currentPage && activeClass,
                isLoading && "opacity-50 cursor-not-allowed",
              )}
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={`Page ${item}`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className={cn(buttonClass, currentPage >= totalPages && disabledClass)}
        aria-label="Next page"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
