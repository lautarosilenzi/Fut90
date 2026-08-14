import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/supabase";

/**
 * Cliente de Supabase para usar en Server Components, Server Actions y
 * Route Handlers. Lee/escribe la sesión en las cookies del pedido.
 *
 * Si se llama desde un Server Component (no una Server Action ni un
 * Route Handler), `setAll` puede fallar porque ahí no se pueden escribir
 * cookies — Supabase ya contempla ese caso y lo ignora en silencio,
 * porque el `proxy.ts` se encarga de refrescar la sesión en cada
 * request de todos modos.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component: no se pueden escribir cookies acá, no pasa nada.
        }
      },
    },
  });
}
