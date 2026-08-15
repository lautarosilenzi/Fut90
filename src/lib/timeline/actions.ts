"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { fetchTimelinePosts } from "@/lib/timeline/queries";
import type { TimelinePost } from "@/lib/timeline/types";

export type TimelineActionResult = { error?: string; success?: true; postId?: string; createdAt?: string };

const MAX_LENGTH = 280;
const MAX_MEDIA = 4;

export async function createPost(
  content: string,
  mediaUrls: string[],
  parentPostId: string | null = null,
): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para tuitear." };

  const trimmed = content.trim();
  const media = mediaUrls.slice(0, MAX_MEDIA);
  if (!trimmed && media.length === 0) return { error: "Escribí algo o subí una foto/video." };
  if (trimmed.length > MAX_LENGTH) return { error: `Máximo ${MAX_LENGTH} caracteres.` };

  const supabase = await createClient();

  if (parentPostId) {
    const { data: parent } = await supabase
      .from("posts")
      .select("id")
      .eq("id", parentPostId)
      .eq("is_deleted", false)
      .maybeSingle();
    if (!parent) return { error: "Ese tuit ya no existe." };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: user.id, content: trimmed, media_urls: media, parent_post_id: parentPostId })
    .select("id, created_at")
    .single();

  if (error || !data) return { error: "No se pudo publicar, probá de nuevo." };

  revalidatePath("/tuits");
  if (parentPostId) revalidatePath(`/tuits/${parentPostId}`);
  revalidatePath(`/perfil/${user.username}`);
  return { success: true, postId: data.id, createdAt: data.created_at };
}

export async function loadMoreTimelinePosts(before: string): Promise<TimelinePost[]> {
  const user = await getCurrentUser();
  return fetchTimelinePosts({ viewerId: user?.id ?? null, before, limit: 20 });
}

export async function deletePost(postId: string): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión." };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").update({ is_deleted: true }).eq("id", postId);
  if (error) return { error: "No se pudo borrar el tuit." };

  revalidatePath("/tuits");
  revalidatePath(`/perfil/${user.username}`);
  return { success: true };
}

export async function toggleLike(postId: string, like: boolean): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para dar me gusta." };

  const supabase = await createClient();
  const { error } = like
    ? await supabase.from("likes").insert({ user_id: user.id, post_id: postId })
    : await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId);

  if (error) return { error: "No se pudo actualizar el me gusta." };
  return { success: true };
}

export async function toggleRepost(postId: string, repost: boolean): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para retuitear." };

  const supabase = await createClient();
  const { error } = repost
    ? await supabase.from("reposts").insert({ user_id: user.id, post_id: postId })
    : await supabase.from("reposts").delete().eq("user_id", user.id).eq("post_id", postId);

  if (error) return { error: "No se pudo actualizar el retuit." };
  revalidatePath("/tuits");
  return { success: true };
}

export async function toggleFollow(userId: string, follow: boolean): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión para seguir." };
  if (user.id === userId) return { error: "No te podés seguir a vos mismo." };

  const supabase = await createClient();
  const { error } = follow
    ? await supabase.from("follows").insert({ follower_id: user.id, following_id: userId })
    : await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", userId);

  if (error) return { error: "No se pudo actualizar." };
  return { success: true };
}

export async function updateProfile(displayName: string, bio: string): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión." };

  const trimmedBio = bio.trim();
  if (trimmedBio.length > 160) return { error: "La bio puede tener hasta 160 caracteres." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName.trim() || null, bio: trimmedBio || null })
    .eq("id", user.id);

  if (error) return { error: "No se pudo actualizar el perfil." };
  revalidatePath(`/perfil/${user.username}`);
  return { success: true };
}

export async function updateAvatar(avatarUrl: string): Promise<TimelineActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Necesitás iniciar sesión." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
  if (error) return { error: "No se pudo actualizar la foto." };

  revalidatePath(`/perfil/${user.username}`);
  return { success: true };
}
