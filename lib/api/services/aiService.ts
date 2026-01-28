interface BoletaAnalisis {
  periodo: string;
  consumoTotal: number;
  monto: number;
  consumoPorHora?: { hora: number; consumo: number }[];
}

interface ConsejosAhorro {
  consejos: string[];
  ahorroEstimado: number;
  horasPico: number[];
  recomendaciones: {
    titulo: string;
    descripcion: string;
    impacto: 'alto' | 'medio' | 'bajo';
  }[];
}

export async function analizarBoletasConIA(boletas: BoletaAnalisis[]): Promise<ConsejosAhorro> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  try {
    const response = await fetch(`${apiUrl}/api/ia/analizar-consumo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ boletas }),
    });

    if (!response.ok) {
      throw new Error('Error al analizar boletas');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en análisis IA:', error);
    return generarConsejosBasicos(boletas);
  }
}

function generarConsejosBasicos(boletas: BoletaAnalisis[]): ConsejosAhorro {
  const consumoPromedio = boletas.reduce((sum, b) => sum + b.consumoTotal, 0) / boletas.length;
  const ultimaBoleta = boletas[boletas.length - 1];
  const variacion = ((ultimaBoleta.consumoTotal - consumoPromedio) / consumoPromedio) * 100;

  const consejos: string[] = [];
  const recomendaciones: ConsejosAhorro['recomendaciones'] = [];

  if (variacion > 10) {
    consejos.push('Tu consumo ha aumentado un ' + variacion.toFixed(1) + '% respecto al promedio');
    recomendaciones.push({
      titulo: 'Reducir consumo en horas pico',
      descripcion: 'Evita usar electrodomésticos de alto consumo entre 18:00 y 23:00 hrs',
      impacto: 'alto',
    });
  }

  if (consumoPromedio > 300) {
    consejos.push('Tu consumo mensual promedio es de ' + consumoPromedio.toFixed(0) + ' kWh');
    recomendaciones.push({
      titulo: 'Optimizar uso de calefacción/refrigeración',
      descripcion: 'Ajusta la temperatura del aire acondicionado o calefacción en 2°C',
      impacto: 'alto',
    });
  }

  recomendaciones.push({
    titulo: 'Desconectar aparatos en standby',
    descripcion: 'Los aparatos en modo standby pueden consumir hasta 10% de tu energía',
    impacto: 'medio',
  });

  recomendaciones.push({
    titulo: 'Usar iluminación LED',
    descripcion: 'Reemplaza ampolletas tradicionales por LED para ahorrar hasta 80%',
    impacto: 'medio',
  });

  return {
    consejos,
    ahorroEstimado: consumoPromedio * 0.15,
    horasPico: [18, 19, 20, 21, 22],
    recomendaciones,
  };
}
