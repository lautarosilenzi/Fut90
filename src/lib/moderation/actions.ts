"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";

export type ModerationActionResult = { error?: string; success?: true };

export async function reportPost(postId: string, reason: string): Promise<ModerationActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para reportar." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .insert({ reporter_id: user.id, post_id: postId, reason });

  if (error) return { error: "No se pudo enviar el reporte." };
  return { success: true };
}

export async function blockUser(userId: string): Promise<ModerationActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para bloquear." };
  if (user.id === userId) return { error: "No te podés bloquear a vos mismo." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("blocks")
    .insert({ blocker_id: user.id, blocked_id: userId });

  if (error) return { error: "No se pudo bloquear al usuario." };
  return { success: true };
}
