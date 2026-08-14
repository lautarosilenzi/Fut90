/**
 * Estas dos variables las tenés que cargar vos (ver README) después de
 * crear el proyecto en supabase.com: están en Project Settings > API.
 * Son públicas a propósito (el prefijo NEXT_PUBLIC_ las manda también al
 * navegador) — la seguridad real la dan las políticas de Row Level
 * Security definidas en supabase/schema.sql, no el secreto de esta clave.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
