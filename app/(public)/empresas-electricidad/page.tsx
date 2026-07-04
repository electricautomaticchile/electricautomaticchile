import { redirect } from "next/navigation";

/**
 * La landing de distribuidoras/compañías eléctricas vive en el sitio de
 * marketing dedicado (proyecto landing-inversion, ruta /distribuidoras), no en
 * la app. Esta ruta solo redirige para no romper enlaces existentes
 * (home, footer, /soluciones) ni URLs ya indexadas.
 *
 * Cuando el sitio de marketing tenga dominio, define NEXT_PUBLIC_LANDING_URL
 * (ej: https://electricautomaticchile.cl) y el redirect apuntará allí
 * automáticamente. Mientras tanto, cae al formulario de contacto.
 */
export default function EmpresasElectricidadRedirect() {
  const landing = process.env.NEXT_PUBLIC_LANDING_URL?.replace(/\/+$/, "");
  redirect(landing ? `${landing}/distribuidoras` : "/formulario");
}
