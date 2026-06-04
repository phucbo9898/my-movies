interface SearchResultInfoProps {
  keyword: string;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export function SearchResultInfo({
  keyword,
  totalItems,
  currentPage,
  itemsPerPage,
}: SearchResultInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border dark:border-white/10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          Search Results
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base dark:text-zinc-400">
          Found{" "}
          <span className="font-semibold text-foreground dark:text-white">
            {totalItems}
          </span>{" "}
          results for{" "}
          <span className="font-semibold text-primary dark:text-blue-400">
            &quot;{keyword}&quot;
          </span>
        </p>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-zinc-400">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 dark:text-zinc-500 mb-1">
            Showing
          </p>
          <p className="text-foreground font-semibold dark:text-white">
            {startItem}–{endItem} of {totalItems}
          </p>
        </div>
      </div>
    </div>
  );
}
