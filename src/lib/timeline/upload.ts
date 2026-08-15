import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export interface MediaUploadResult {
  url: string;
  kind: "image" | "video";
}

function extensionOf(file: File, fallback: string): string {
  const fromName = file.name.split(".").pop();
  return fromName && fromName.length <= 5 ? fromName : fallback;
}

/** Sube una foto o video de un tuit al bucket `post-media`, en la carpeta del usuario. */
export async function uploadPostMedia(file: File, userId: string): Promise<MediaUploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato no soportado. Usá JPG, PNG, WEBP, GIF o MP4/WEBM.");
  }
  const isVideo = file.type.startsWith("video/");
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(isVideo ? "El video no puede pesar más de 60 MB." : "La imagen no puede pesar más de 8 MB.");
  }

  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}.${extensionOf(file, isVideo ? "mp4" : "jpg")}`;

  const { error } = await supabase.storage
    .from("post-media")
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw new Error("No se pudo subir el archivo.");

  const { data } = supabase.storage.from("post-media").getPublicUrl(path);
  return { url: data.publicUrl, kind: isVideo ? "video" : "image" };
}

/** Sube una foto de perfil al bucket `avatars`, en la carpeta del usuario. */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("La foto de perfil tiene que ser una imagen.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("La imagen no puede pesar más de 8 MB.");

  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}.${extensionOf(file, "jpg")}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw new Error("No se pudo subir la foto.");

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
