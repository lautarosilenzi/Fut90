import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface CurrentUser {
  id: string;
  username: string;
  displayName: string | null;
  isAdmin: boolean;
}

/** Devuelve el usuario logueado (con su perfil) o `null`. Server-only. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, is_admin")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    username: profile.username,
    displayName: profile.display_name,
    isAdmin: profile.is_admin,
  };
}
