"use client";

import { useState } from "react";
import { IEmpresa, ICrearEmpresa, regiones } from "../types";

export function useEmpresaModals() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<IEmpresa | null>(null);

  const [nuevaEmpresa, setNuevaEmpresa] = useState<ICrearEmpresa>({
    nombreEmpresa: "",
    razonSocial: "",
    rut: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    region: "",
    contactoPrincipal: {
      nombre: "",
      cargo: "",
      telefono: "",
      correo: "",
    },
  });

  const resetFormulario = () => {
    setNuevaEmpresa({
      nombreEmpresa: "",
      razonSocial: "",
      rut: "",
      correo: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      region: "",
      contactoPrincipal: {
        nombre: "",
        cargo: "",
        telefono: "",
        correo: "",
      },
    });
  };

  const abrirModalCrear = () => {
    resetFormulario();
    setShowCreateModal(true);
  };

  const cerrarModalCrear = () => {
    setShowCreateModal(false);
    resetFormulario();
  };

  const abrirModalDetalle = (empresa: IEmpresa) => {
    setSelectedEmpresa(empresa);
    setShowDetailModal(true);
  };

  const cerrarModalDetalle = () => {
    setShowDetailModal(false);
    setSelectedEmpresa(null);
  };

  const actualizarNuevaEmpresa = (campo: keyof ICrearEmpresa, valor: any) => {
    if (campo === "contactoPrincipal") {
      setNuevaEmpresa((prev) => ({
        ...prev,
        contactoPrincipal: {
          ...prev.contactoPrincipal,
          ...valor,
        },
      }));
    } else {
      setNuevaEmpresa((prev) => ({
        ...prev,
        [campo]: valor,
      }));
    }
  };

  return {
    // Estados de modales
    showCreateModal,
    showDetailModal,
    selectedEmpresa,

    // Estado del formulario
    nuevaEmpresa,

    // Acciones de modales
    abrirModalCrear,
    cerrarModalCrear,
    abrirModalDetalle,
    cerrarModalDetalle,

    // Acciones del formulario
    actualizarNuevaEmpresa,
    resetFormulario,

    // Setters directos para casos especiales
    setShowCreateModal,
    setShowDetailModal,
    setSelectedEmpresa,
    setNuevaEmpresa,

    // Datos de apoyo
    regiones,
  };
}
