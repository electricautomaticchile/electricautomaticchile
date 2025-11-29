'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showDetails?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Previene que errores de React causen "white screen of death"
 * Logs automáticos de errores y UI de fallback amigable
 * 
 * @example
 * <ErrorBoundary>
 *   <MiComponente />
 * </ErrorBoundary>
 * 
 * @example Con fallback custom
 * <ErrorBoundary fallback={<MiErrorPersonalizado />}>
 *   <MiComponente />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Actualizar estado para que el siguiente render muestre la UI de fallback
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Logging del error

        // Guardar errorInfo en el estado
        this.setState({
            errorInfo,
        });

        // Callback personalizado si se proporcionó
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // TODO: Enviar a servicio de logging/monitoring (ej: Sentry)
        this.logErrorToService(error, errorInfo);
    }

    /**
     * Enviar error a servicio de monitoring
     * En producción, integrar con Sentry, LogRocket, etc.
     */
    private logErrorToService(error: Error, errorInfo: ErrorInfo) {
        // En desarrollo, solo log a consola
        if (process.env.NODE_ENV === 'development') {
            console.group('🐛 Error Boundary - Detalles');
            console.groupEnd();
            return;
        }

        // En producción, enviar a servicio de monitoring
        try {
            // Ejemplo: Sentry.captureException(error, { contexts: { react: errorInfo } });

            // O enviar a API propia
            fetch('/api/logs/error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                    },
                    errorInfo: {
                        componentStack: errorInfo.componentStack,
                    },
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                }),
            }).catch((err) => {
            });
        } catch (loggingError) {
        }
    }

    /**
     * Resetear el error boundary
     */
    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    /**
     * Recargar la página
     */
    private handleReload = () => {
        window.location.reload();
    };

    /**
     * Ir al inicio
     */
    private handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Usar fallback custom si se proporcionó
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // UI de fallback por defecto
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
                    <div className="max-w-2xl w-full">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                        <AlertTriangle className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">
                                            ¡Ups! Algo salió mal
                                        </h1>
                                        <p className="text-white/90 mt-1">
                                            Ocurrió un error inesperado en esta página
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                <p className="text-gray-700 dark:text-gray-300">
                                    No te preocupes, nuestro equipo ha sido notificado y trabajaremos para
                                    solucionarlo lo antes posible.
                                </p>

                                {/* Error Details (solo en desarrollo) */}
                                {this.props.showDetails && process.env.NODE_ENV === 'development' && (
                                    <details className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                        <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                                            <Bug className="h-5 w-5" />
                                            <span>Detalles técnicos (solo en desarrollo)</span>
                                        </summary>
                                        <div className="mt-4 space-y-2">
                                            <div>
                                                <p className="font-mono text-sm text-red-600 dark:text-red-400">
                                                    {this.state.error?.toString()}
                                                </p>
                                            </div>
                                            {this.state.error?.stack && (
                                                <div className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                                        {this.state.error.stack}
                                                    </pre>
                                                </div>
                                            )}
                                            {this.state.errorInfo?.componentStack && (
                                                <div className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                                                    <p className="text-xs font-semibold mb-2 text-blue-400">
                                                        Component Stack:
                                                    </p>
                                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                                        {this.state.errorInfo.componentStack}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={this.handleReset}
                                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        <span>Intentar de nuevo</span>
                                    </button>

                                    <button
                                        onClick={this.handleReload}
                                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        <span>Recargar página</span>
                                    </button>

                                    <button
                                        onClick={this.handleGoHome}
                                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        <Home className="h-5 w-5" />
                                        <span>Ir al inicio</span>
                                    </button>
                                </div>

                                {/* Support Info */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                        💡 <strong>¿Necesitas ayuda?</strong> Si el problema persiste, contáctanos
                                        en{' '}
                                        <a
                                            href="mailto:soporte@electricautomaticchile.com"
                                            className="underline hover:text-blue-600"
                                        >
                                            soporte@electricautomaticchile.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
