/**
 * Configuración de marca — el único lugar que hay que tocar si el nombre,
 * el eslogan o la descripción de la app cambian más adelante.
 * Nada de esto debería estar escrito a mano en ningún otro archivo.
 */
export const brand = {
  name: "Fut90",
  shortName: "Fut90",
  tagline: "El resultado de tu equipo, al toque. La previa y la posterior, con la gente.",
  description:
    "Resultados en vivo, fixture y tablas de posiciones del fútbol argentino, con el chat del hincha para vivir cada partido con otros hinchas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-AR",
  themeColor: "#0B1220",
} as const;
