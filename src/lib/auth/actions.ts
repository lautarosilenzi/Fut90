"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthActionState = { error?: string } | null;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

function friendlyAuthError(message: string): string {
  if (message.includes("already registered")) return "Ese email ya tiene una cuenta creada.";
  if (message.includes("profiles_username_key") || message.includes("username"))
    return "Ese nombre de usuario ya está en uso, probá con otro.";
  if (message.includes("Invalid login credentials")) return "Email o contraseña incorrectos.";
  if (message.includes("Password should be"))
    return "La contraseña tiene que tener al menos 6 caracteres.";
  return message;
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return { error: "El registro todavía no está configurado (falta conectar Supabase)." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  if (!USERNAME_PATTERN.test(username)) {
    return { error: "El usuario tiene que tener entre 3 y 20 letras, números o _." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: friendlyAuthError(error.message) };

  redirect("/");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return { error: "El login todavía no está configurado (falta conectar Supabase)." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: friendlyAuthError(error.message) };

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
