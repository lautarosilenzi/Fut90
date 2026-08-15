"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { createPost } from "@/lib/timeline/actions";
import { uploadPostMedia } from "@/lib/timeline/upload";
import type { CurrentUser } from "@/lib/auth/current-user";
import type { TimelinePost } from "@/lib/timeline/types";

const MAX_LENGTH = 280;
const MAX_FILES = 4;

interface PendingMedia {
  file: File;
  previewUrl: string;
}

export function PostComposer({
  currentUser,
  parentPostId = null,
  placeholder = "¿Qué está pasando?",
  onPosted,
}: {
  currentUser: CurrentUser;
  parentPostId?: string | null;
  placeholder?: string;
  onPosted?: (post: TimelinePost) => void;
}) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<PendingMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_LENGTH - content.length;
  const canSubmit = (content.trim().length > 0 || files.length > 0) && remaining >= 0 && !uploading && !pending;

  function handleFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    const next = [...files];
    for (const file of Array.from(list)) {
      if (next.length >= MAX_FILES) break;
      next.push({ file, previewUrl: URL.createObjectURL(file) });
    }
    setFiles(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    let mediaUrls: string[] = [];
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploaded = await Promise.all(files.map((f) => uploadPostMedia(f.file, currentUser.id)));
        mediaUrls = uploaded.map((u) => u.url);
      } catch (err) {
        setUploading(false);
        setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
        return;
      }
      setUploading(false);
    }

    const trimmed = content.trim();
    startTransition(async () => {
      const result = await createPost(trimmed, mediaUrls, parentPostId);
      if (result.error || !result.postId || !result.createdAt) {
        setError(result.error ?? "No se pudo publicar, probá de nuevo.");
        return;
      }

      onPosted?.({
        id: result.postId,
        content: trimmed,
        mediaUrls,
        createdAt: result.createdAt,
        parentPostId,
        author: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatarUrl: currentUser.avatarUrl,
        },
        likeCount: 0,
        repostCount: 0,
        replyCount: 0,
        likedByViewer: false,
        repostedByViewer: false,
      });

      setContent("");
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      setFiles([]);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 border-b border-neutral-800 p-4">
      <Avatar name={currentUser.username} avatarUrl={currentUser.avatarUrl} />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={placeholder}
          rows={parentPostId ? 2 : 3}
          className="w-full resize-none bg-transparent text-lg text-neutral-50 outline-none placeholder:text-neutral-600"
        />

        {files.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {files.map((f, index) => (
              <div key={f.previewUrl} className="relative overflow-hidden rounded-xl border border-neutral-800">
                {f.file.type.startsWith("video/") ? (
                  <video src={f.previewUrl} className="aspect-video w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- previsualización de un blob local, next/image no lo soporta
                  <img src={f.previewUrl} alt="" className="aspect-square w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950/80 text-neutral-50 hover:bg-neutral-950"
                  aria-label="Quitar"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-neutral-800 pt-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_FILES}
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-400 hover:bg-brand-900/40 disabled:opacity-40"
            aria-label="Adjuntar foto o video"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-5 w-5">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
              <circle cx="9" cy="10.5" r="1.8" stroke="currentColor" />
              <path d="m4 17 5-5 3 3 4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />

          <div className="flex items-center gap-3">
            <span className={`text-xs tabular-nums ${remaining < 0 ? "text-danger" : "text-neutral-500"}`}>
              {remaining}
            </span>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-accent-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-accent-400 disabled:opacity-50"
            >
              {uploading ? "Subiendo…" : pending ? "Publicando…" : parentPostId ? "Responder" : "Tuitear"}
            </button>
          </div>
        </div>

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </div>
    </form>
  );
}
