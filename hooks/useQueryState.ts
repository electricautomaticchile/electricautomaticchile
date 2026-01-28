"use client";

import { UseQueryResult } from "@tanstack/react-query";

export function useQueryState<T>(query: UseQueryResult<T, Error>) {
  const { data, isLoading, isError, error, refetch, isFetching } = query;

  return {
    data: data as T | undefined,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isEmpty: !isLoading && !isError && (!data || (Array.isArray(data) && data.length === 0)),
  };
}

export function useMutationState() {
  return {
    isOptimistic: true,
  };
}
