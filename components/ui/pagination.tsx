import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/lib/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  getPageHref,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageRange = getPaginationRange(currentPage, totalPages);
  const buttonClass =
    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border border-white/10 bg-zinc-950/20 px-3 text-sm font-medium text-white transition hover:bg-white/5";
  const activeClass = "bg-white/10 text-white border-white/20";
  const disabledClass = "pointer-events-none opacity-50";

  return (
    <div className="flex min-w-0 flex-row items-center justify-between gap-2 overflow-x-auto py-2">
      <a
        href={currentPage > 1 ? getPageHref(currentPage - 1) : "#"}
        className={cn(buttonClass, currentPage === 1 && disabledClass)}
        aria-disabled={currentPage === 1}
      >
        ←
      </a>

      <div className="flex min-w-0 flex-nowrap items-center justify-center gap-2">
        {pageRange.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm text-zinc-400"
            >
              ...
            </span>
          ) : (
            <a
              key={item}
              href={getPageHref(item)}
              className={cn(buttonClass, item === currentPage && activeClass)}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </a>
          ),
        )}
      </div>

      <a
        href={currentPage < totalPages ? getPageHref(currentPage + 1) : "#"}
        className={cn(buttonClass, currentPage === totalPages && disabledClass)}
        aria-disabled={currentPage === totalPages}
      >
        →
      </a>
    </div>
  );
}
