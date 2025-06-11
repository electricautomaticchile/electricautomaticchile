"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function DebugApi() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "N/A";

  const runConnectivityTest = async () => {
    setLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      frontend: {
        origin: currentOrigin,
        apiUrl: API_BASE_URL,
        environment: process.env.NODE_ENV,
      },
      tests: {},
    };

    // Test 1: Health Check
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      results.tests.healthCheck = {
        success: healthResponse.ok,
        status: healthResponse.status,
        statusText: healthResponse.statusText,
        data: healthResponse.ok ? await healthResponse.json() : null,
        error: !healthResponse.ok ? `HTTP ${healthResponse.status}` : null,
      };
    } catch (error) {
      results.tests.healthCheck = {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }

    // Test 2: API Info
    try {
      const apiResponse = await fetch(`${API_BASE_URL}/api`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      results.tests.apiInfo = {
        success: apiResponse.ok,
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        data: apiResponse.ok ? await apiResponse.json() : null,
        error: !apiResponse.ok ? `HTTP ${apiResponse.status}` : null,
      };
    } catch (error) {
      results.tests.apiInfo = {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }

    // Test 3: CORS Test (Clientes endpoint)
    try {
      const corsResponse = await fetch(`${API_BASE_URL}/api/clientes`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      results.tests.corsTest = {
        success: corsResponse.ok,
        status: corsResponse.status,
        statusText: corsResponse.statusText,
        headers: {
          "access-control-allow-origin": corsResponse.headers.get(
            "access-control-allow-origin"
          ),
          "access-control-allow-credentials": corsResponse.headers.get(
            "access-control-allow-credentials"
          ),
          "access-control-allow-methods": corsResponse.headers.get(
            "access-control-allow-methods"
          ),
        },
        error: !corsResponse.ok ? `HTTP ${corsResponse.status}` : null,
      };
    } catch (error) {
      results.tests.corsTest = {
        success: false,
        error: error instanceof Error ? error.message : "Error CORS",
      };
    }

    // Test 4: OPTIONS Preflight
    try {
      const preflightResponse = await fetch(`${API_BASE_URL}/api/clientes`, {
        method: "OPTIONS",
        headers: {
          Origin: currentOrigin,
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "Content-Type,Authorization",
        },
      });

      results.tests.preflight = {
        success: preflightResponse.ok,
        status: preflightResponse.status,
        statusText: preflightResponse.statusText,
        headers: {
          "access-control-allow-origin": preflightResponse.headers.get(
            "access-control-allow-origin"
          ),
          "access-control-allow-methods": preflightResponse.headers.get(
            "access-control-allow-methods"
          ),
          "access-control-allow-headers": preflightResponse.headers.get(
            "access-control-allow-headers"
          ),
        },
      };
    } catch (error) {
      results.tests.preflight = {
        success: false,
        error: error instanceof Error ? error.message : "Error en preflight",
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "OK" : "FAIL"}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Debug de Conectividad API
          <Button onClick={runConnectivityTest} disabled={loading} size="sm">
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {loading ? "Ejecutando..." : "Ejecutar Tests"}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del Frontend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded">
            <div className="text-sm font-medium">Origen Frontend</div>
            <div className="text-xs text-muted-foreground font-mono">
              {currentOrigin}
            </div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm font-medium">URL API</div>
            <div className="text-xs text-muted-foreground font-mono">
              {API_BASE_URL}
            </div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm font-medium">Entorno</div>
            <div className="text-xs text-muted-foreground">
              {process.env.NODE_ENV}
            </div>
          </div>
        </div>

        {/* Resultados de Tests */}
        {testResults && (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Resultados de Conectividad:
            </div>

            {/* Health Check */}
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.tests.healthCheck?.success)}
                <span className="font-medium">Health Check</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.tests.healthCheck?.success)}
                <span className="text-xs text-muted-foreground">
                  Status: {testResults.tests.healthCheck?.status || "N/A"}
                </span>
              </div>
            </div>

            {/* API Info */}
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.tests.apiInfo?.success)}
                <span className="font-medium">API Info</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.tests.apiInfo?.success)}
                <span className="text-xs text-muted-foreground">
                  Status: {testResults.tests.apiInfo?.status || "N/A"}
                </span>
              </div>
            </div>

            {/* CORS Test */}
            <div className="p-3 border rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.tests.corsTest?.success)}
                  <span className="font-medium">CORS Test (/api/clientes)</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(testResults.tests.corsTest?.success)}
                  <span className="text-xs text-muted-foreground">
                    Status: {testResults.tests.corsTest?.status || "N/A"}
                  </span>
                </div>
              </div>
              {testResults.tests.corsTest?.headers && (
                <div className="text-xs space-y-1">
                  <div>
                    Access-Control-Allow-Origin:{" "}
                    {testResults.tests.corsTest.headers[
                      "access-control-allow-origin"
                    ] || "NO PRESENTE"}
                  </div>
                  <div>
                    Access-Control-Allow-Methods:{" "}
                    {testResults.tests.corsTest.headers[
                      "access-control-allow-methods"
                    ] || "NO PRESENTE"}
                  </div>
                </div>
              )}
              {testResults.tests.corsTest?.error && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {testResults.tests.corsTest.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Preflight Test */}
            <div className="p-3 border rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.tests.preflight?.success)}
                  <span className="font-medium">Preflight OPTIONS</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(testResults.tests.preflight?.success)}
                  <span className="text-xs text-muted-foreground">
                    Status: {testResults.tests.preflight?.status || "N/A"}
                  </span>
                </div>
              </div>
              {testResults.tests.preflight?.headers && (
                <div className="text-xs space-y-1">
                  <div>
                    Access-Control-Allow-Origin:{" "}
                    {testResults.tests.preflight.headers[
                      "access-control-allow-origin"
                    ] || "NO PRESENTE"}
                  </div>
                  <div>
                    Access-Control-Allow-Methods:{" "}
                    {testResults.tests.preflight.headers[
                      "access-control-allow-methods"
                    ] || "NO PRESENTE"}
                  </div>
                  <div>
                    Access-Control-Allow-Headers:{" "}
                    {testResults.tests.preflight.headers[
                      "access-control-allow-headers"
                    ] || "NO PRESENTE"}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground text-center">
              Última ejecución:{" "}
              {new Date(testResults.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Si ves errores CORS:</strong>
            <br />
            1. Verifica que tu dominio esté en la lista de origins permitidos
            del backend
            <br />
            2. Asegúrate de que el backend esté ejecutándose
            <br />
            3. Verifica que la variable NEXT_PUBLIC_API_URL esté correcta
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
