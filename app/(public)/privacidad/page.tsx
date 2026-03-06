import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Electricautomaticchile",
  description:
    "Política de privacidad y protección de datos personales de Electricautomaticchile. Conoce tus derechos ARCO y cómo tratamos tu información.",
};

const PrivacidadPage = () => {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="container mx-auto px-4 py-20 max-w-4xl relative z-10">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <span className="text-sm font-medium text-orange-300">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="text-white/40 text-sm">Última actualización: marzo de 2025</p>
        </div>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">1. Responsable del Tratamiento</h2>
            <p>
              Electricautomaticchile SpA, con domicilio en Chile, es responsable del tratamiento de sus datos personales
              recopilados a través de{" "}
              <a href="https://www.electricautomaticchile.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                www.electricautomaticchile.com
              </a>{" "}
              y sus aplicaciones móviles.
            </p>
            <p className="mt-2">
              Contacto:{" "}
              <a href="mailto:electricautomaticchile@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                electricautomaticchile@gmail.com
              </a>
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">2. Datos que Recopilamos</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Datos de identificación: nombre completo, RUT, correo electrónico, teléfono.</li>
              <li>Datos de ubicación: dirección del suministro eléctrico.</li>
              <li>Datos de consumo: lecturas de medidores, historial de consumo eléctrico.</li>
              <li>Datos técnicos: dirección IP, tipo de dispositivo, sistema operativo, logs de acceso.</li>
              <li>Datos de pago: información de transacciones (no almacenamos datos de tarjetas directamente).</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">3. Finalidad del Tratamiento</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Prestación del servicio de monitoreo y gestión eléctrica.</li>
              <li>Gestión de su cuenta de usuario y autenticación.</li>
              <li>Emisión de facturas y gestión de pagos.</li>
              <li>Envío de notificaciones sobre consumo y alertas del sistema.</li>
              <li>Mejora de nuestros productos y servicios.</li>
              <li>Cumplimiento de obligaciones legales y regulatorias.</li>
              <li>Comunicaciones comerciales (solo con su consentimiento previo).</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">4. Base Legal del Tratamiento</h2>
            <p>
              El tratamiento se basa en: (a) la ejecución del contrato de servicios suscrito con la Compañía;
              (b) el cumplimiento de obligaciones legales aplicables en Chile, incluyendo la Ley N° 19.628 sobre
              Protección de la Vida Privada; (c) su consentimiento expreso para finalidades específicas.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">5. Sus Derechos (Derechos ARCO)</h2>
            <p className="mb-3">De conformidad con la Ley N° 19.628, usted tiene los siguientes derechos:</p>
            <ul className="space-y-3">
              {[
                { titulo: "Acceso", desc: "Solicitar información sobre qué datos personales suyos tratamos, con qué finalidad y a quién han sido comunicados." },
                { titulo: "Rectificación", desc: "Solicitar la corrección de datos inexactos o incompletos." },
                { titulo: "Cancelación (Supresión)", desc: "Solicitar la eliminación de sus datos cuando ya no sean necesarios, salvo obligación legal de conservarlos." },
                { titulo: "Oposición", desc: "Oponerse al tratamiento de sus datos para finalidades de marketing directo." },
                { titulo: "Portabilidad", desc: "Recibir sus datos en un formato estructurado para transferirlos a otro responsable." },
                { titulo: "Revocación del consentimiento", desc: "Retirar su consentimiento en cualquier momento sin afectar la licitud del tratamiento previo." },
              ].map((d) => (
                <li key={d.titulo} className="flex gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                  <span><span className="text-white font-medium">{d.titulo}:</span> {d.desc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, envíe una solicitud a{" "}
              <a href="mailto:electricautomaticchile@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                electricautomaticchile@gmail.com
              </a>{" "}
              indicando su nombre, RUT y el derecho que desea ejercer. Responderemos en máximo 30 días hábiles.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">6. Conservación de Datos</h2>
            <p>
              Conservamos sus datos durante el tiempo necesario para cumplir las finalidades descritas y las
              obligaciones legales. Los datos de consumo eléctrico se conservan por un mínimo de 5 años conforme
              a la normativa eléctrica chilena. Tras finalizar la relación contractual, los datos se eliminan o
              anonimizan en un plazo máximo de 12 meses.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">7. Transferencia de Datos a Terceros</h2>
            <p className="mb-2">No vendemos ni cedemos sus datos con fines comerciales. Podemos compartirlos con:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Proveedores de servicios tecnológicos bajo acuerdos de confidencialidad.</li>
              <li>Autoridades regulatorias o judiciales cuando sea legalmente requerido.</li>
              <li>Empresas distribuidoras eléctricas para la prestación del servicio contratado.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">8. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas: cifrado en tránsito (TLS/HTTPS),
              control de acceso basado en roles y monitoreo continuo de seguridad. En caso de brecha de
              seguridad que afecte sus derechos, le notificaremos a la brevedad.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">9. Cookies</h2>
            <p>
              Utilizamos cookies estrictamente necesarias para el funcionamiento del sitio (autenticación, sesión).
              No utilizamos cookies de seguimiento publicitario de terceros.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white text-lg mb-3">10. Legislación Aplicable</h2>
            <p>
              Esta Política se rige por la legislación chilena, en particular la Ley N° 19.628 sobre Protección
              de la Vida Privada. Para cualquier controversia, las partes se someten a los tribunales ordinarios de Chile.
            </p>
          </section>

          <div className="text-center text-sm text-white/40 pt-4">
            ¿Tienes preguntas?{" "}
            <a href="mailto:electricautomaticchile@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors">
              electricautomaticchile@gmail.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacidadPage;
