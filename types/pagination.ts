export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export function createPaginationParams(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  sortBy?: string,
  sortDir: "asc" | "desc" = "desc"
): PaginationParams {
  return {
    page: Math.max(1, page),
    pageSize: Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE),
    sortBy,
    sortDir,
  };
}

export function buildPaginationQuery(params: PaginationParams): string {
  const query = new URLSearchParams();
  query.append("paginated", "true");
  query.append("page", params.page.toString());
  query.append("pageSize", params.pageSize.toString());
  if (params.sortBy) {
    query.append("sortBy", params.sortBy);
  }
  if (params.sortDir) {
    query.append("sortDir", params.sortDir);
  }
  return query.toString();
}
