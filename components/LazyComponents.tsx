'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyComponentProps {
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
    onError?: (error: Error) => void;
}

/**
 * Loading Skeleton - UI de carga por defecto
 */
export function LoadingSkeleton({ message = 'Cargando...' }: { message?: string }) {
    return (
        <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
            </div>
        </div>
    );
}

/**
 * Card Skeleton - Para listas y grids
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            ))}
        </div>
    );
}

/**
 * Table Skeleton - Para tablas
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="w-full animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {Array.from({ length: columns }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
                {/* Rows */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <div key={colIndex} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Chart Skeleton - Para gráficos
 */
export function ChartSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
        </div>
    );
}

/**
 * Utilidad para crear componentes lazy con Suspense automático
 */
/**
 * Utilidad para crear componentes lazy con Suspense automático
 */
export function createLazyComponent<P extends object>(
    importFn: () => Promise<{ default: ComponentType<P> }>,
    options: LazyComponentProps = {}
) {
    const LazyComponent = lazy(importFn);

    return function LazyWrapper(props: P) {
        const { fallback = <LoadingSkeleton />, errorFallback, onError } = options;

        return (
            <Suspense fallback={fallback}>
                <LazyComponent {...(props as any)} />
            </Suspense>
        );
    };
}

/**
 * HOC para lazy loading con error boundary integrado
 */
export function withLazyLoading<P extends object>(
    Component: ComponentType<P>,
    options: LazyComponentProps = {}
) {
    return function LazyLoadedComponent(props: P) {
        const { fallback = <LoadingSkeleton />, errorFallback, onError } = options;

        return (
            <Suspense fallback={fallback}>
                <Component {...(props as any)} />
            </Suspense>
        );
    };
}

/**
 * Lazy Route Component - Para rutas completas
 */
export function LazyRoute({
    component: Component,
    loading,
    error,
    ...props
}: {
    component: ComponentType<any>;
    loading?: React.ReactNode;
    error?: React.ReactNode;
    [key: string]: any;
}) {
    return (
        <Suspense fallback={loading || <LoadingSkeleton message="Cargando página..." />}>
            <Component {...props} />
        </Suspense>
    );
}

const LazyComponents = {
    LoadingSkeleton,
    CardSkeleton,
    TableSkeleton,
    ChartSkeleton,
    createLazyComponent,
    withLazyLoading,
    LazyRoute,
};

export default LazyComponents;
