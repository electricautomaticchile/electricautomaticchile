export interface FilterParams {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  type?: string;
  active?: boolean;
  clienteId?: string;
  empresaId?: string;
  resuelta?: boolean;
  estado?: string;
}

export function buildFilterQuery(filters: FilterParams): string {
  const query = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value.toString());
    }
  });
  
  return query.toString();
}

export function combineQueryParams(
  pagination: string,
  filters: string
): string {
  const params = [];
  if (pagination) params.push(pagination);
  if (filters) params.push(filters);
  return params.join("&");
}
