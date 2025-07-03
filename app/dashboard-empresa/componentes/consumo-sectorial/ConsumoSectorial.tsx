"use client";
import { Lightbulb } from "lucide-react";
import { ConsumoSectorialProps } from "./types";
import { useConsumoSectorial } from "./useConsumoSectorial";
import { ConsumoSectorialAcciones } from "./ConsumoSectorialAcciones";
import { ConsumoSectorialTabs } from "./ConsumoSectorialTabs";
import { ConsumoSectorialReducido } from "./ConsumoSectorialReducido";

export function ConsumoSectorial({ reducida = false }: ConsumoSectorialProps) {
  const {
    periodoSeleccionado,
    loading,
    datosSectores,
    datosAreas,
    datosFranjasHorarias,
    estadoExportacion,
    setPeriodoSeleccionado,
    handleExportarConsumoSectorial,
  } = useConsumoSectorial();

  // Para la versión reducida del componente
  if (reducida) {
    return <ConsumoSectorialReducido datos={datosSectores} loading={loading} />;
  }

  // Versión completa del componente
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-orange-600" />
          Consumo por Sector
        </h2>

        <ConsumoSectorialAcciones
          periodoSeleccionado={periodoSeleccionado}
          onPeriodoChange={setPeriodoSeleccionado}
          estadoExportacion={estadoExportacion}
          onExportar={handleExportarConsumoSectorial}
        />
      </div>

      <ConsumoSectorialTabs
        datosSectores={datosSectores}
        datosAreas={datosAreas}
        datosFranjasHorarias={datosFranjasHorarias}
        loading={loading}
      />
    </div>
  );
}
