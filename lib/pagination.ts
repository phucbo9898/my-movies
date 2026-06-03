export type PaginationToken = number | "ellipsis";

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
): PaginationToken[] {
  const page = Math.max(1, Math.min(currentPage, totalPages));

  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, "ellipsis", totalPages - 1, totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [page - 1, page, page + 1, "ellipsis", totalPages - 1, totalPages];
}
