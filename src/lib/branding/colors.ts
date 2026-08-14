/**
 * Paleta de Fut90 — fuente de verdad de los colores de marca.
 *
 * Estos mismos valores están escritos también en `src/app/globals.css`
 * (bloque `@theme`), porque Tailwind v4 genera las clases de utilidad
 * (`bg-brand-600`, `text-accent-400`, etc.) leyendo variables CSS en
 * tiempo de build, no un archivo .ts. Si cambiás un color acá, cambialo
 * también ahí — son las dos mitades de una misma paleta, nunca un color
 * "suelto" adentro de un componente.
 *
 * Usá este archivo cuando necesites el valor hex en código JS/TS (por
 * ejemplo el `theme-color` del navegador, o un color de gráfico).
 */
export const colors = {
  brand: {
    50: "#EFF4FC",
    100: "#DCE7F8",
    200: "#BCD1F0",
    300: "#93B3E3",
    400: "#6690D2",
    500: "#3F70BE",
    600: "#2D59A0",
    700: "#1E3A8A",
    800: "#172C69",
    900: "#101F4C",
    950: "#0B1633",
  },
  accent: {
    300: "#F8D585",
    400: "#F5C451",
    500: "#F2B705",
    600: "#C99404",
  },
  neutral: {
    50: "#F5F7FC",
    100: "#E9EDF6",
    200: "#D2DAEA",
    300: "#ABB8D1",
    400: "#8393B4",
    500: "#5A6D93",
    600: "#33456B",
    700: "#223154",
    800: "#16213B",
    900: "#10192E",
    950: "#0B1220",
  },
  live: "#E11D2E",
  success: "#22C55E",
  warning: "#F97316",
  danger: "#E11D2E",
} as const;
