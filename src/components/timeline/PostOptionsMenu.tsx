"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { reportPost, blockUser } from "@/lib/moderation/actions";
import { deletePost } from "@/lib/timeline/actions";
import type { CurrentUser } from "@/lib/auth/current-user";

export function PostOptionsMenu({
  postId,
  authorId,
  authorUsername,
  currentUser,
  onDeleted,
}: {
  postId: string;
  authorId: string;
  authorUsername: string;
  currentUser: CurrentUser;
  onDeleted?: (postId: string) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reported, setReported] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwn = currentUser.id === authorId;
  const canDelete = isOwn || currentUser.isAdmin;

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleDelete() {
    if (!confirm("¿Borrar este tuit? No se puede deshacer.")) return;
    setBusy(true);
    const result = await deletePost(postId);
    setBusy(false);
    if (!result.error) {
      setOpen(false);
      onDeleted?.(postId);
      router.refresh();
    }
  }

  async function handleReport() {
    setBusy(true);
    await reportPost(postId, "contenido_inapropiado");
    setBusy(false);
    setReported(true);
  }

  async function handleBlock() {
    if (!confirm(`¿Bloquear a @${authorUsername}? No vas a ver más sus tuits.`)) return;
    setBusy(true);
    const result = await blockUser(authorId);
    setBusy(false);
    if (!result.error) {
      setOpen(false);
      onDeleted?.(postId);
      router.refresh();
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-900/40 hover:text-brand-400"
        aria-label="Más opciones"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 text-sm shadow-lg">
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="block w-full px-4 py-2.5 text-left text-danger hover:bg-neutral-800"
            >
              Borrar
            </button>
          )}
          {!isOwn && (
            <>
              <button
                type="button"
                onClick={handleReport}
                disabled={busy || reported}
                className="block w-full px-4 py-2.5 text-left text-neutral-200 hover:bg-neutral-800 disabled:text-neutral-500"
              >
                {reported ? "Reportado" : "Reportar"}
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={busy}
                className="block w-full px-4 py-2.5 text-left text-neutral-200 hover:bg-neutral-800"
              >
                Bloquear
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
