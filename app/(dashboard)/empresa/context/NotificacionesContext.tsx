"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useNotificacionesEmpresa } from "../features/alertas/useNotificacionesEmpresa";

interface Notificacion {
    _id: string;
    titulo: string;
    mensaje: string;
    tipo: "info" | "success" | "warning" | "error";
    prioridad: "baja" | "media" | "alta" | "urgente";
    categoria: "consumo" | "facturacion" | "dispositivo" | "mantenimiento" | "sistema";
    leida: boolean;
    fechaLectura?: Date;
    accion?: {
        texto: string;
        url: string;
        tipo: "link" | "button";
    };
    metadata?: any;
    createdAt: Date;
}

interface NotificacionesContextType {
    notificaciones: Notificacion[];
    loading: boolean;
    estadisticas: {
        total: number;
        noLeidas: number;
        porCategoria: any;
        porPrioridad: any;
    };
    resumen: {
        total: number;
        noLeidas: number;
        urgentes: number;
        altas: number;
        porTipo: {
            error: number;
            warning: number;
            info: number;
            success: number;
        };
        porCategoria: {
            consumo: number;
            facturacion: number;
            dispositivo: number;
            mantenimiento: number;
            sistema: number;
        };
    };
    estaConectado: boolean;
    marcarComoLeida: (notificacionId: string) => Promise<void>;
    marcarTodasComoLeidas: () => Promise<void>;
    eliminarNotificacion: (notificacionId: string) => Promise<void>;
    recargar: () => Promise<void>;
}

const NotificacionesContext = createContext<NotificacionesContextType | undefined>(undefined);

interface NotificacionesProviderProps {
    children: ReactNode;
}

export function NotificacionesProvider({ children }: NotificacionesProviderProps) {
    const notificacionesData = useNotificacionesEmpresa();

    useEffect(() => {
        const interval = setInterval(() => {
            notificacionesData.recargar();
        }, 30000);
        
        return () => clearInterval(interval);
    }, [notificacionesData]);

    return (
        <NotificacionesContext.Provider value={notificacionesData}>
            {children}
        </NotificacionesContext.Provider>
    );
}

export function useNotificaciones() {
    const context = useContext(NotificacionesContext);

    if (context === undefined) {
        throw new Error("useNotificaciones debe ser usado dentro de NotificacionesProvider");
    }

    return context;
}
