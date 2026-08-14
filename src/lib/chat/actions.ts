"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getMatch } from "@/lib/football-data";

export type ChatActionResult = { error?: string; success?: true };

const MAX_LENGTH = 280;

export async function postChatMessage(matchId: string, content: string): Promise<ChatActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para escribir." };

  const trimmed = content.trim();
  if (!trimmed) return { error: "Escribí algo primero." };
  if (trimmed.length > MAX_LENGTH) return { error: `Máximo ${MAX_LENGTH} caracteres.` };

  // El estado "en vivo" se vuelve a chequear acá, del lado del servidor:
  // nunca hay que confiar en lo que mande el navegador para esta regla.
  const match = await getMatch(matchId);
  if (!match || match.status !== "live") {
    return { error: "El chat solo está abierto mientras el partido se está jugando." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    match_id: matchId,
    content: trimmed,
  });

  if (error) return { error: "No se pudo enviar el mensaje, probá de nuevo." };
  return { success: true };
}
