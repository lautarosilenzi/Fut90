"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { updateProfile, updateAvatar } from "@/lib/timeline/actions";
import { uploadAvatar } from "@/lib/timeline/upload";
import type { ProfileSummary } from "@/lib/timeline/types";

export function EditProfileForm({ profile }: { profile: ProfileSummary }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAvatar(file, profile.id);
      const result = await updateAvatar(url);
      if (result.error) setError(result.error);
      else router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    }
    setUploading(false);
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateProfile(displayName, bio);
      if (result.error) setError(result.error);
      else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="relative flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleAvatarChange(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Subiendo…" : "Cambiar foto"}
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
        Editar perfil
      </Button>

      {open && (
        <form
          onSubmit={handleSave}
          className="absolute right-0 top-full z-20 mt-2 flex w-72 flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-lg"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-neutral-300">Nombre</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={50}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none focus:border-accent-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-neutral-300">Bio</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={160}
              rows={3}
              className="resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none focus:border-accent-500"
            />
          </label>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
