"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Medidor {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  direccion: string;
  estado: "active" | "suspicious" | "fraud_detected" | "inactive";
  consumo: number;
  anomalias: number;
  serial: string;
}

interface LeafletMapProps {
  medidores: Medidor[];
  filtro: string;
}

export function LeafletMap({ medidores, filtro }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear mapa centrado en Barnechea
    mapRef.current = L.map(mapContainerRef.current).setView(
      [-33.36, -70.52],
      14
    );

    // Agregar capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian los medidores
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Crear nuevos marcadores
    medidores.forEach((medidor, index) => {
      const markerConfig = getMarkerConfig(medidor.estado);

      // Crear icono personalizado
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${markerConfig.color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-weight: bold;
            color: white;
            font-size: 12px;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Crear marcador
      const marker = L.marker([medidor.lat, medidor.lng], { icon }).addTo(
        mapRef.current!
      );

      // Crear popup
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${markerConfig.color};">
            ${markerConfig.icon} ${medidor.nombre}
          </h3>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            <strong>Dirección:</strong> ${medidor.direccion}
          </p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            <strong>Consumo:</strong> ${medidor.consumo} kWh
          </p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            <strong>Serial:</strong> ${medidor.serial}
          </p>
          <div style="
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-top: 4px;
            background-color: ${markerConfig.bgColor};
            color: ${markerConfig.textColor};
          ">
            ${markerConfig.text}
          </div>
          ${
            medidor.anomalias > 0
              ? `<p style="color: #dc2626; font-weight: 600; margin-top: 8px; font-size: 12px;">
              ⚠️ ${medidor.anomalias} anomalías GPS detectadas
            </p>`
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      // Animación al hover
      marker.on("mouseover", () => {
        marker.openPopup();
      });

      markersRef.current.push(marker);
    });

    // Ajustar vista para mostrar todos los marcadores
    if (medidores.length > 0) {
      const bounds = L.latLngBounds(
        medidores.map((m) => [m.lat, m.lng] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [medidores]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

function getMarkerConfig(estado: string) {
  switch (estado) {
    case "active":
      return {
        color: "#22c55e",
        icon: "✓",
        text: "Activo",
        bgColor: "#dcfce7",
        textColor: "#166534",
      };
    case "suspicious":
      return {
        color: "#eab308",
        icon: "⚠",
        text: "Sospechoso",
        bgColor: "#fef3c7",
        textColor: "#92400e",
      };
    case "fraud_detected":
      return {
        color: "#ef4444",
        icon: "🚨",
        text: "Fraude",
        bgColor: "#fee2e2",
        textColor: "#991b1b",
      };
    case "inactive":
      return {
        color: "#9ca3af",
        icon: "⭕",
        text: "Inactivo",
        bgColor: "#f3f4f6",
        textColor: "#4b5563",
      };
    default:
      return {
        color: "#3b82f6",
        icon: "•",
        text: "Desconocido",
        bgColor: "#dbeafe",
        textColor: "#1e40af",
      };
  }
}
