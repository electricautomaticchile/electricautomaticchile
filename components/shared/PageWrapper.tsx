"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GlobalLoadingState } from "./GlobalLoadingState";
import { ErrorState } from "./ErrorState";

interface PageWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingMessage?: string;
  errorMessage?: string;
}

export function PageWrapper({
  children,
  isLoading,
  isError,
  error,
  onRetry,
  loadingMessage,
  errorMessage,
}: PageWrapperProps) {
  if (isLoading) {
    return <GlobalLoadingState message={loadingMessage} fullScreen />;
  }

  if (isError) {
    return (
      <ErrorState
        message={errorMessage || error?.message || "Error al cargar la página"}
        onRetry={onRetry}
        fullScreen
      />
    );
  }

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === "development"}>
      {children}
    </ErrorBoundary>
  );
}
