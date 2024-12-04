import React from "react";

export default function AcercaDePage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 text-center mb-8">
          Electricautomaticchile
        </h1>
        <h2 className="text-2xl text-orange-600 text-center mb-12">
          Innovación al servicio de la eficiencia energética en Chile
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Características principales */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Reposición del Servicio Automatizada
            </h3>
            <p className="text-gray-600">
              Una vez regularizada la deuda, el servicio se repone automáticamente, 
              sin necesidad de intervención manual y sin tiempos de espera prolongados.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Toma de Lectura Automatizada
            </h3>
            <p className="text-gray-600">
              El dispositivo registra el consumo energético y envía reportes instantáneos 
              a la plataforma web y al cliente vía mensaje de texto y correo electrónico.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Gestión Eficiente
            </h3>
            <p className="text-gray-600">
              La plataforma web proporciona herramientas para la gestión del suministro 
              eléctrico, ofreciendo mayor control y transparencia.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Seguridad Avanzada
            </h3>
            <p className="text-gray-600">
              Equipado con GPS para rastreo y capacidad de diagnóstico remoto 
              para reconfiguración y detección de fallas.
            </p>
          </div>
        </div>

        {/* Sección adicional */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-orange-600 mb-6">
            Nuestro Compromiso
          </h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Ofrecemos programas completos de capacitación para personal técnico 
              y usuarios finales, cubriendo todos los aspectos de nuestra tecnología.
            </p>
            <p>
              Buscamos establecer colaboraciones sólidas con compañías eléctricas, 
              entidades gubernamentales y comunidades locales para mejorar el 
              suministro eléctrico en todo Chile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
