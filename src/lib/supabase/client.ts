"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/supabase";

/** Cliente de Supabase para usar en Client Components. */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
