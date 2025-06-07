'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { HealthService } from '@/lib/services/backend.service';

interface BackendStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function BackendStatus({ showDetails = false, className }: BackendStatusProps) {
  const [status, setStatus] = useState<{
    connected: boolean;
    loading: boolean;
    error?: string;
    details?: any;
  }>({
    connected: false,
    loading: true,
  });

  const checkBackendStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const response = await HealthService.getBackendStatus();
      
      setStatus({
        connected: response.backend || false,
        loading: false,
        details: response,
      });
    } catch (error: any) {
      setStatus({
        connected: false,
        loading: false,
        error: error.message || 'Error de conexión',
      });
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Verificar estado cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (status.loading) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    
    if (status.connected) {
      return <Wifi className="h-4 w-4 text-green-600" />;
    }
    
    return <WifiOff className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = () => {
    if (status.loading) {
      return (
        <Badge variant="secondary" className={className}>
          {getStatusIcon()}
          <span className="ml-1">Verificando...</span>
        </Badge>
      );
    }
    
    if (status.connected) {
      return (
        <Badge variant="default" className={`bg-green-600 hover:bg-green-700 ${className}`}>
          {getStatusIcon()}
          <span className="ml-1">Backend Conectado</span>
        </Badge>
      );
    }
    
    return (
      <Badge variant="destructive" className={className}>
        {getStatusIcon()}
        <span className="ml-1">Backend Desconectado</span>
      </Badge>
    );
  };

  // Versión compacta (solo badge)
  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        {getStatusBadge()}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={checkBackendStatus}
          disabled={status.loading}
          title="Verificar conexión"
        >
          <RefreshCw className={`h-3 w-3 ${status.loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  // Versión detallada
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Estado del Backend</h3>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={checkBackendStatus}
            disabled={status.loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${status.loading ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      </div>

      {status.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error de conexión:</strong> {status.error}
            <br />
            <small className="text-xs opacity-75 mt-1 block">
              Verifica que el backend esté ejecutándose en {process.env.NEXT_PUBLIC_API_URL}
            </small>
          </AlertDescription>
        </Alert>
      )}

      {status.connected && status.details && (
        <Alert>
          <Wifi className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div><strong>Conexión exitosa</strong></div>
              <div className="text-sm space-y-1">
                <div>API Version: {status.details.apiVersion || 'N/A'}</div>
                <div>Entorno: {status.details.environment || 'N/A'}</div>
                <div>URL: {process.env.NEXT_PUBLIC_API_URL}</div>
                {status.details.timestamp && (
                  <div>Última verificación: {new Date(status.details.timestamp).toLocaleTimeString()}</div>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!status.connected && !status.loading && !status.error && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div><strong>Backend no disponible</strong></div>
              <div className="text-sm">
                No se pudo conectar con el servidor backend.
                <br />
                <small className="opacity-75">
                  Asegúrate de que esté ejecutándose en {process.env.NEXT_PUBLIC_API_URL}
                </small>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 