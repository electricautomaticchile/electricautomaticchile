import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");
    const fecha = searchParams.get("fecha");
    const limit = searchParams.get("limit") || "50";

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint parameter is required" },
        { status: 400 }
      );
    }

    // Construir la URL de la API del Coordinador Eléctrico
    const baseUrl = "https://sipub.api.coordinador.cl/sipub/api/v2";
    const apiUrl = new URL(`${baseUrl}/${endpoint}/`);

    // Agregar parámetros - usando la variable correcta
    const apiKey =
      process.env.NEXT_PUBLIC_COORDINADOR_API_KEY ||
      process.env.COORDINADOR_API_KEY ||
      "demo_key";
    apiUrl.searchParams.set("user_key", apiKey);
    if (fecha) apiUrl.searchParams.set("fecha", fecha);
    apiUrl.searchParams.set("limit", limit);

    console.log(`Fetching from Coordinador API: ${apiUrl.toString()}`);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "ElectricAutomaticChile-Platform/1.0",
      },
      // Cache por 5 minutos
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(
        `Error from Coordinador API: ${response.status} ${response.statusText}`
      );

      // Devolver datos de demostración si la API no está disponible
      const demoData = getDemoData(endpoint);
      return NextResponse.json(demoData);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Coordinador API:", error);

    // Devolver datos de demostración en caso de error
    const endpoint = request.nextUrl.searchParams.get("endpoint") || "";
    const demoData = getDemoData(endpoint);

    return NextResponse.json(demoData);
  }
}

// Función para generar datos de demostración
function getDemoData(endpoint: string) {
  const currentDate = new Date().toISOString().split("T")[0];

  switch (endpoint) {
    case "demanda_sistema_real":
      return {
        count: 24,
        next: null,
        previous: null,
        results: Array.from({ length: 24 }, (_, i) => ({
          fecha: currentDate,
          hora: i + 1,
          demanda: 8000 + Math.random() * 2000,
        })),
      };

    case "generacion_centrales":
      return {
        count: 50,
        next: null,
        previous: null,
        results: Array.from({ length: 50 }, (_, i) => ({
          id_central: `CENTRAL_${i + 1}`,
          fecha: currentDate,
          hora: Math.floor(Math.random() * 24) + 1,
          generacion: Math.random() * 500,
          energia_ernc: Math.random() * 200,
          tipo_central: ["Solar", "Eólica", "Hidráulica", "Térmica"][
            Math.floor(Math.random() * 4)
          ],
        })),
      };

    case "costos_marginales_reales":
      return {
        count: 20,
        next: null,
        previous: null,
        results: Array.from({ length: 20 }, (_, i) => ({
          barra_mnemotecnico: `BARRA_${i + 1}`,
          barra_referencia_mnemotecnico: `REF_BARRA_${i + 1}`,
          fecha: currentDate,
          hora: Math.floor(Math.random() * 24) + 1,
          costo_en_dolares: 100 + Math.random() * 100,
          costo_en_pesos: (100 + Math.random() * 100) * 850,
        })),
      };

    case "generacion_programada":
      return {
        count: 30,
        next: null,
        previous: null,
        results: Array.from({ length: 30 }, (_, i) => ({
          empresa_mnemotecnico: `EMP_${i + 1}`,
          fecha: currentDate,
          hora: Math.floor(Math.random() * 24) + 1,
          generacion: Math.random() * 1000,
          tipo_central: ["Solar", "Eólica", "Hidráulica", "Térmica"][
            Math.floor(Math.random() * 4)
          ],
          nombre_empresa: `Empresa ${i + 1}`,
        })),
      };

    case "cotas_embalses":
      return {
        count: 12,
        next: null,
        previous: null,
        results: Array.from({ length: 12 }, (_, i) => ({
          nombre_embalse: `Embalse ${i + 1}`,
          fecha: currentDate,
          hora: Math.floor(Math.random() * 24) + 1,
          cota: 600 + Math.random() * 200,
          afluente_diario: Math.random() * 50,
        })),
      };

    default:
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
  }
}
