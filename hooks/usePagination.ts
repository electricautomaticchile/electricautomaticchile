"use client";
import { useState, useCallback } from "react";
import { PaginationParams, createPaginationParams } from "@/types/pagination";

export function usePagination(initialPageSize: number = 10) {
  const [params, setParams] = useState<PaginationParams>(
    createPaginationParams(1, initialPageSize)
  );

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy: string, sortDir: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sortBy, sortDir }));
  }, []);

  const nextPage = useCallback(() => {
    setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setParams((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  const reset = useCallback(() => {
    setParams(createPaginationParams(1, initialPageSize));
  }, [initialPageSize]);

  return {
    params,
    setPage,
    setPageSize,
    setSort,
    nextPage,
    prevPage,
    reset,
  };
}
